import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator }                                from '@angular/material/paginator';
import { MatSort }                                     from '@angular/material/sort';
import { MatTable }                                    from '@angular/material/table';
import { GroceryTableDataSource }                      from './grocery-table-datasource';
import { GroceryService }                              from './grocery.service';
import { GroceryItem }                                 from './model/grocery-item';

@Component(
    {
        selector:    'app-grocery-table',
        templateUrl: './grocery-table.component.html',
        styleUrls:   ['./grocery-table.component.less']
    }
)
export class GroceryTableComponent implements AfterViewInit, OnInit {

    dataSource: GroceryTableDataSource;

    readonly displayedColumns: ReadonlyArray<string> = ['amount', 'name'];

    @ViewChild(MatPaginator)
    private paginator: MatPaginator;
    @ViewChild(MatSort)
    private sort: MatSort;
    @ViewChild(MatTable)
    private table: MatTable<GroceryItem>;

    constructor(private groceryService: GroceryService) {
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

}
