import { DataSource }                             from '@angular/cdk/collections';
import { MatPaginator }                           from '@angular/material/paginator';
import { MatSort }                                from '@angular/material/sort';
import { catchError, map }                        from 'rxjs/operators';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { GroceryService }                         from './grocery.service';
import { GroceryItem }                            from './model/grocery-item';

/**
 * Data source for the GroceryTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class GroceryTableDataSource extends DataSource<GroceryItem> {

    private grocerySubject = new BehaviorSubject<GroceryItem[]>([]);
    private groceryObservable = this.grocerySubject.asObservable();

    paginator: MatPaginator;
    sort: MatSort;

    count = 0;

    constructor(private groceryService: GroceryService) {
        super();
    }

    getGroceries(): void {
        this.groceryService
            .getGroceries()
            .pipe(catchError(() => of(Array<GroceryItem>())))
            .subscribe((groceries) => {
                this.grocerySubject.next(groceries);

                this.count = groceries.length;
            });
    }

    addGroceries(grocery: GroceryItem): void {
        this.groceryService
            .getGroceries()
            .pipe(catchError(() => of(Array<GroceryItem>())))
            .subscribe((groceries) => {
                groceries.push(grocery);
                this.grocerySubject.next(groceries);
                this.count = groceries.length;
            });
    }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    connect(): Observable<GroceryItem[]> {
        // Combine everything that affects the rendered data into one update
        // stream for the data-table to consume.
        const dataMutations = [
            this.groceryObservable,
            this.paginator.page,
            this.sort.sortChange
        ];

        return merge(...dataMutations).pipe(map(() => {
            return this.getPagedData(this.getSortedData([...this.grocerySubject.value]));
        }));
    }

    /**
     *  Called when the table is being destroyed. Use this function, to clean up
     * any open connections or free any held resources that were set up during connect.
     */
    disconnect(): void {
    }

    /**
     * Paginate the data (client-side). If you're using server-side pagination,
     * this would be replaced by requesting the appropriate data from the server.
     */
    private getPagedData(data: GroceryItem[]): GroceryItem[] {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }

    /**
     * Sort the data (client-side). If you're using server-side sorting,
     * this would be replaced by requesting the appropriate data from the server.
     */
    private getSortedData(data: GroceryItem[]): GroceryItem[] {
        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                case 'name':
                    return compare(a.name, b.name, isAsc);
                default:
                    return 0;
            }
        });
    }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
