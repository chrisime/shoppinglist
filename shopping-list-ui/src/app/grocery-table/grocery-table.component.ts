import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog }                                   from '@angular/material/dialog';
import { MatPaginator }                                from '@angular/material/paginator';
import { MatSort }                                     from '@angular/material/sort';
import { MatTable }                                    from '@angular/material/table';

import { GroceryTableDataSource }                      from './grocery-table-datasource';
import { GroceryService }                              from './grocery.service';
import { GroceryItem }                                 from './model/grocery-item';
import { DialogBoxComponent }                          from '../dialog-box/dialog-box.component';

@Component(
    {
        selector:    'app-grocery-table',
        templateUrl: './grocery-table.component.html',
        styleUrls:   ['./grocery-table.component.less']
    }
)
export class GroceryTableComponent implements AfterViewInit, OnInit {

    readonly displayedColumns: ReadonlyArray<string> = ['amount', 'name', 'action'];

    @ViewChild(MatPaginator)
    private paginator: MatPaginator;
    @ViewChild(MatSort)
    private sort: MatSort;
    @ViewChild(MatTable)
    private table: MatTable<GroceryItem>;

    private groceryTableDataSource: GroceryTableDataSource;

    private selectedRow = null;

    constructor(private groceryService: GroceryService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.groceryTableDataSource = new GroceryTableDataSource(this.groceryService);
        this.groceryTableDataSource.getGroceries();
    }

    ngAfterViewInit(): void {
        this.groceryTableDataSource.sort = this.sort;
        this.groceryTableDataSource.paginator = this.paginator;
        this.table.dataSource = this.groceryTableDataSource;
    }

    get rows(): number {
        return this.groceryTableDataSource.count;
    }

    openDialog(action: 'Add' | 'Update' | 'Delete', obj): void {
        obj.action = action;
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '250px',
            data:  obj
        });

        dialogRef.afterClosed()
                 .subscribe(result => {
                     if (result.event === 'Add') {
                         this.addRowData(result.data);
                     } else if (result.event === 'Update') {
                         this.updateRowData(result.data);
                     } else if (result.event === 'Delete') {
                         this.deleteRowData(result.data);
                     }
                 });
    }

    addRowData(groceryItem: GroceryItem): void {
        this.groceryTableDataSource.addGroceries(groceryItem);
    }

    updateRowData(rowObject: GroceryItem): void {
        // this.groceryTableDataSource = this.groceryTableDataSource.filter((value, key) => {
        //     if (value.name === rowObject.name) {
        //         value.name = rowObject.name;
        //     }
        //     return true;
        // });
    }

    deleteRowData(rowObject: GroceryItem): void {
        // this.groceryTableDataSource = this.groceryTableDataSource.filter((value, key) => {
        //     return value.name !== rowObject.name;
        // });
    }

    toggleRow(row: number): void {
        this.selectedRow = this.selectedRow === row ? null : row;
    }

    isSelected(row: number): boolean {
        return row === this.selectedRow;
    }

}
