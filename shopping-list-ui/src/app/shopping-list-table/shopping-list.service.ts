import { Injectable }                              from '@angular/core';
import { BehaviorSubject, Observable, throwError }    from 'rxjs';
import { ShoppingListItem }                           from './model/shopping-list-item';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError }                                 from 'rxjs/operators';

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
            console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError('Something bad happened; please try again later.');
    }

    get count(): number {
        return this.cnt;
    }

    getGroceries(): void {
        this.httpClient
            .get<ShoppingListItem[]>(this.api, this.options)
            .subscribe(
                (data: ShoppingListItem[]) => {
                    console.log('FOOOOOOOOOOO:', data.join(','));
                    this.groceriesSubject.next(data);
                    this.cnt = data.length;
                },
                (error) => ShoppingListService.handleError(error)
            );
    }

    addGrocery(item: ShoppingListItem): void {
        this.httpClient
            .post<ShoppingListItem>(this.api, item, this.options)
            .pipe(catchError((error) => ShoppingListService.handleError(error)));
    }

    updateGrocery(item: ShoppingListItem): void {
        this.httpClient
            .get(this.api, this.options)
            .subscribe(
                (data: ShoppingListItem[]) => {
                    const found = data.find(current => {
                        return current.id === item.id;
                    });
                    found.name = item.name;

                    this.groceriesSubject.next(data);
                }
            );
    }

}
