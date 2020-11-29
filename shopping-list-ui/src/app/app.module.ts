import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';

import { AppRoutingModule }           from './app-routing.module';
import { AppComponent }               from './app.component';
import { DialogBoxComponent }         from './dialog-box/dialog-box.component';
import { ShoppingListTableComponent } from './shopping-list-table/shopping-list-table.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from '@angular/common/http';
import { MatTableModule }          from '@angular/material/table';
import { MatPaginatorModule }      from '@angular/material/paginator';
import { MatSortModule }           from '@angular/material/sort';
import { MatDialogModule }         from '@angular/material/dialog';
import { MatInputModule }          from '@angular/material/input';
import { MatButtonModule }         from '@angular/material/button';
import { MatFormFieldModule }      from '@angular/material/form-field';
import { FormsModule }             from '@angular/forms';

@NgModule({
  declarations: [
      AppComponent,
      DialogBoxComponent,
      ShoppingListTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
