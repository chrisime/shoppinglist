import { Injectable }                                 from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';

import { ShoppingList, ShoppingListAddItem, ShoppingListItem, ShoppingListModifyItem } from './model/shopping-list-item';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {

    private readonly api = '/api/v1/shopping-list';
    private readonly options = {
        responseType: 'json' as const,
        observe:      'body' as const,
        headers:      new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    private cnt = 0;

    groceriesSubject: BehaviorSubject<ShoppingListItem[]> = new BehaviorSubject<ShoppingListItem[]>([]);
    groceries$: Observable<ShoppingListItem[]> = this.groceriesSubject.asObservable();

    constructor(private httpClient: HttpClient) {
    }

    private static handleError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(`Backend returned code ${error.status}, error was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError('Something bad happened; please try again later.');
    }

    get count(): number {
        return this.cnt;
    }

    getGroceries(): void {
        this.httpClient
            .get<ShoppingList>(this.api, this.options)
            .subscribe(
                (data: ShoppingList) => {
                    this.groceriesSubject.next(data.items);
                    this.cnt = data.items.length;
                },
                (error) => ShoppingListService.handleError(error)
            );
    }

    addItem(item: ShoppingListAddItem): void {
        this.httpClient
            .post<ShoppingList>(this.api, item, this.options)
            .subscribe(
                () => this.getGroceries(),
                (error) => ShoppingListService.handleError(error)
            );
    }

    updateItem(item: ShoppingListModifyItem): void {
        this.httpClient
            .put<ShoppingListModifyItem>(this.api, item, this.options)
            .subscribe(
                () => this.getGroceries(),
                (error) => ShoppingListService.handleError(error)
            );
    }

    removeItem(item: ShoppingListItem): void {
        this.httpClient
            .delete<ShoppingListItem>(`${this.api}/${item.identifier}`, this.options)
            .subscribe(
                () => this.getGroceries(),
                (error) => ShoppingListService.handleError(error)
            );
    }

}
