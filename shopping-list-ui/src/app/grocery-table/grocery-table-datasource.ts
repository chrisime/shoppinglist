import { DataSource }                         from '@angular/cdk/collections';
import { MatPaginator }                       from '@angular/material/paginator';
import { MatSort }                            from '@angular/material/sort';
import { map }                                from 'rxjs/operators';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { GroceryService }                     from './grocery.service';
import { GroceryItem }                        from './model/grocery-item';

/**
 * Data source for the GroceryTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class GroceryTableDataSource extends DataSource<GroceryItem> {

    private grocerySubject = new BehaviorSubject<GroceryItem[]>([]);

    paginator: MatPaginator;
    sort: MatSort;
    count: number;

    constructor(private groceryService: GroceryService) {
        super();
        this.count = 0;
    }

    loadGroceries(): void {
        this.groceryService
            .getGroceries()
            .subscribe(grocery => {
                this.grocerySubject.next(grocery);

                this.count = grocery.length;
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
            // observableOf(this.data),
            this.grocerySubject.asObservable(),
            this.paginator.page,
            this.sort.sortChange
        ];

        return merge(...dataMutations).pipe(map(() => {
            // return this.getPagedData(this.getSortedData([...this.data]));
            return this.getPagedData(this.getSortedData([...this.grocerySubject.getValue()]));
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
                // case 'id':
                //   return compare(+a.id, +b.id, isAsc);
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
