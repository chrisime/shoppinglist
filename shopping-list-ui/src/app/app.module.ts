import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';

import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { GroceryTableComponent }   from './grocery-table/grocery-table.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule }          from '@angular/material/table';
import { MatPaginatorModule }      from '@angular/material/paginator';
import { MatSortModule }           from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    GroceryTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
