import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog }                                   from '@angular/material/dialog';
import { MatPaginator }                                from '@angular/material/paginator';
import { MatSort }                                     from '@angular/material/sort';
import { MatTable }                                    from '@angular/material/table';

import { GroceryTableDataSource } from './grocery-table-datasource';
import { GroceryService }         from './grocery.service';
import { GroceryItem }            from './model/grocery-item';
import { DialogBoxComponent }     from '../dialog-box/dialog-box.component';

@Component(
    {
        selector:    'app-grocery-table',
        templateUrl: './grocery-table.component.html',
        styleUrls:   ['./grocery-table.component.less']
    }
)
export class GroceryTableComponent implements AfterViewInit, OnInit {

    readonly displayedColumns: ReadonlyArray<string> = ['amount', 'name', 'action', 'addButton'];

    highlightedRows: GroceryItem[];

    @ViewChild(MatPaginator)
    private paginator: MatPaginator;
    @ViewChild(MatSort)
    private sort: MatSort;
    @ViewChild(MatTable)
    private table: MatTable<GroceryItem>;

    private groceryTableDataSource: GroceryTableDataSource;

    constructor(private groceryService: GroceryService, private dialog: MatDialog) {
        this.highlightedRows = [];
    }

    ngOnInit(): void {
        this.groceryTableDataSource = new GroceryTableDataSource(this.groceryService);
        this.groceryTableDataSource.groceryService.getGroceries();
    }

    ngAfterViewInit(): void {
        this.groceryTableDataSource.sort = this.sort;
        this.groceryTableDataSource.paginator = this.paginator;
        this.table.dataSource = this.groceryTableDataSource;
    }

    get rows(): number {
        return this.groceryTableDataSource.groceryService.count;
    }

    openDialog(action: 'Add' | 'Update' | 'Delete', obj): void {
        obj.action = action;
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '250px',
            height: '250px',
            data:  obj
        });

        dialogRef.afterClosed()
                 .subscribe(result => {
                     if (result.event === 'Add') {
                         this.groceryTableDataSource.groceryService.addGrocery(result.data);
                         this.groceryTableDataSource.groceryService.getGroceries();
                     } else if (result.event === 'Update') {
                         this.groceryTableDataSource.groceryService.updateGrocery(result.data);
                         // this.table.renderRows();
                     } else if (result.event === 'Delete') {
                         this.deleteRowData(result.data);
                     }
                 });
    }
    deleteRowData(rowObject: GroceryItem): void {
        // this.groceryTableDataSource = this.groceryTableDataSource.filter((value, key) => {
        //     return value.name !== rowObject.name;
        // });
    }

    toggleRow(row: GroceryItem): void {
        // row.isSelected = !row.isSelected;
        if (this.highlightedRows.indexOf(row) === -1) {
            this.highlightedRows.push(row);
        } else {
            const filtered = this.highlightedRows.filter(cur => cur !== row);

            delete this.highlightedRows;

            this.highlightedRows = filtered;
        }
    }

    isSelected(row: GroceryItem): boolean {
        return this.highlightedRows.indexOf(row) !== -1;
    }

}
