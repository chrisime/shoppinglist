import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog }                                   from '@angular/material/dialog';
import { MatPaginator }                                from '@angular/material/paginator';
import { MatSort }                                     from '@angular/material/sort';
import { MatTable }                                    from '@angular/material/table';

import { ShoppingListTableDatasource } from './shopping-list-table-datasource';
import { ShoppingListService }         from './shopping-list.service';
import { ShoppingListItem }            from './model/shopping-list-item';
import { DialogBoxComponent }  from '../dialog-box/dialog-box.component';

@Component(
    {
        selector:    'app-shopping-list-table',
        templateUrl: './shopping-list-table.component.html',
        styleUrls:   ['./shopping-list-table.component.less']
    }
)
export class ShoppingListTableComponent implements AfterViewInit, OnInit {

    readonly displayedColumns: ReadonlyArray<string> = ['amount', 'name', 'action', 'addButton'];

    highlightedRows: ShoppingListItem[];

    @ViewChild(MatPaginator)
    private paginator: MatPaginator;
    @ViewChild(MatSort)
    private sort: MatSort;
    @ViewChild(MatTable)
    private table: MatTable<ShoppingListItem>;

    private shoppingListTableDataSource: ShoppingListTableDatasource;

    constructor(private shoppingListService: ShoppingListService, private dialog: MatDialog) {
        this.highlightedRows = [];
    }

    ngOnInit(): void {
        this.shoppingListTableDataSource = new ShoppingListTableDatasource(this.shoppingListService);
        this.shoppingListTableDataSource.shoppinglistService.getGroceries();
    }

    ngAfterViewInit(): void {
        this.shoppingListTableDataSource.sort = this.sort;
        this.shoppingListTableDataSource.paginator = this.paginator;
        this.table.dataSource = this.shoppingListTableDataSource;
    }

    get rows(): number {
        return this.shoppingListTableDataSource.shoppinglistService.count;
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
                         this.shoppingListTableDataSource.shoppinglistService.addGrocery(result.data);
                         this.shoppingListTableDataSource.shoppinglistService.getGroceries();
                         this.table.renderRows();
                     } else if (result.event === 'Update') {
                         this.shoppingListTableDataSource.shoppinglistService.updateGrocery(result.data);
                         // this.table.renderRows();
                     } else if (result.event === 'Delete') {
                         this.deleteRowData(result.data);
                     }
                 });
    }
    deleteRowData(rowObject: ShoppingListItem): void {
        // this.groceryTableDataSource = this.groceryTableDataSource.filter((value, key) => {
        //     return value.name !== rowObject.name;
        // });
    }

    toggleRow(row: ShoppingListItem): void {
        // row.isSelected = !row.isSelected;
        if (this.highlightedRows.indexOf(row) === -1) {
            this.highlightedRows.push(row);
        } else {
            const filtered = this.highlightedRows.filter(cur => cur !== row);

            delete this.highlightedRows;

            this.highlightedRows = filtered;
        }
    }

    isSelected(row: ShoppingListItem): boolean {
        return this.highlightedRows.indexOf(row) !== -1;
    }

}
