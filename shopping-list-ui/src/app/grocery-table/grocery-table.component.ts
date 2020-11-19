import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator }                                from '@angular/material/paginator';
import { MatSort }                                     from '@angular/material/sort';
import { MatTable }                                    from '@angular/material/table';
import { GroceryTableDataSource }                      from './grocery-table-datasource';
import { GroceryService }                              from './grocery.service';
import { GroceryItem }                                 from './model/grocery-item';

@Component({
               selector:    'app-grocery-table',
               templateUrl: './grocery-table.component.html',
               styleUrls:   ['./grocery-table.component.less']
           })
export class GroceryTableComponent implements AfterViewInit, OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<GroceryItem>;
    dataSource: GroceryTableDataSource;

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['amount', 'name'];

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
