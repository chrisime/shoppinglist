import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator }                                from '@angular/material/paginator';
import { MatSort }                                     from '@angular/material/sort';
import { MatTable }                                    from '@angular/material/table';
import { GroceryTableDataSource }                      from './grocery-table-datasource';
import { GroceryService }                              from './grocery.service';
import { GroceryItem }                                 from './model/grocery-item';
import { MatDialog }                                   from '@angular/material/dialog';
import { DialogBoxComponent }                          from '../dialog-box/dialog-box.component';

@Component(
    {
        selector:    'app-grocery-table',
        templateUrl: './grocery-table.component.html',
        styleUrls:   ['./grocery-table.component.less']
    }
)
export class GroceryTableComponent implements AfterViewInit, OnInit {

    dataSource: GroceryTableDataSource;

    readonly displayedColumns: ReadonlyArray<string> = ['amount', 'name', 'action'];

    @ViewChild(MatPaginator)
    private paginator: MatPaginator;
    @ViewChild(MatSort)
    private sort: MatSort;
    @ViewChild(MatTable)
    private table: MatTable<GroceryItem>;

    private selectedRow = null;

    constructor(private groceryService: GroceryService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.dataSource = new GroceryTableDataSource(this.groceryService);
        this.dataSource.loadGroceries();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
    }

    openDialog(action: string, obj): void {
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

    addRowData(rowObject: GroceryItem): void {
        const date = new Date();
        // this.dataSource.push({
        //                          id:   date.getTime(),
        //                          name: rowObject.name
        //                      });
        this.table.renderRows();

    }

    updateRowData(rowObject: GroceryItem): void {
        // this.dataSource = this.dataSource.filter((value, key) => {
        //     if (value.name === rowObject.name) {
        //         value.name = rowObject.name;
        //     }
        //     return true;
        // });
    }

    deleteRowData(rowObject: GroceryItem): void {
        // this.dataSource = this.dataSource.filter((value, key) => {
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
