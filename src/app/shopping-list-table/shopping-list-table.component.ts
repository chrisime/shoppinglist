import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog }                                   from '@angular/material/dialog';
import { MatPaginator }                                from '@angular/material/paginator';
import { MatSort }                                     from '@angular/material/sort';
import { MatTable }                                    from '@angular/material/table';

import { ShoppingListTableDatasource } from './shopping-list-table-datasource';
import { ShoppingListService }         from './shopping-list.service';
import { ShoppingListItem }            from './model/shopping-list-item';
import { DialogBoxComponent }          from '../dialog-box/dialog-box.component';

@Component(
    {
        selector:    'app-shopping-list-table',
        templateUrl: './shopping-list-table.component.html',
        styleUrls:   ['./shopping-list-table.component.less']
    }
)
export class ShoppingListTableComponent implements AfterViewInit, OnInit {

    readonly displayedColumns: ReadonlyArray<string> = ['amount', 'name', 'action', 'addButton'];

    highlightedRows: ShoppingListItem[] = [];

    @ViewChild(MatPaginator)
    private paginator: MatPaginator;
    @ViewChild(MatSort)
    private sort: MatSort;
    @ViewChild(MatTable)
    private table: MatTable<ShoppingListItem>;

    private readonly shoppingListTableDataSource: ShoppingListTableDatasource;

    constructor(private shoppingListService: ShoppingListService, private dialog: MatDialog) {
        this.highlightedRows = [];
        this.shoppingListTableDataSource = new ShoppingListTableDatasource(this.shoppingListService);
    }

    ngOnInit(): void {
        this.shoppingListService.getGroceries();
    }

    ngAfterViewInit(): void {
        this.shoppingListTableDataSource.sort = this.sort;
        this.shoppingListTableDataSource.paginator = this.paginator;
        this.table.dataSource = this.shoppingListTableDataSource;
    }

    get rows(): number {
        return this.shoppingListService.count;
    }

    openDialog(action: 'Add' | 'Edit' | 'Delete', obj: any): void {
        obj.action = action;

        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width:        '250px',
            autoFocus:    true,
            data:         obj,
            disableClose: true,
        });

        dialogRef.afterClosed()
                 .subscribe(result => {
                     if (result.event === 'Add') {
                         this.shoppingListService.addItem(result.data);
                         this.table.renderRows();
                     } else if (result.event === 'Edit') {
                         this.shoppingListService.updateItem(result.data);
                         // this.table.renderRows();
                     } else if (result.event === 'Delete') {
                         this.shoppingListService.removeItem(result.data);
                     }
                 });
    }

    toggleRow(row: ShoppingListItem): void {
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
