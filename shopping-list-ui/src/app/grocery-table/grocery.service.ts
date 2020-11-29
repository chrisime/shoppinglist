import { Injectable }                              from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { GroceryItem }                             from './model/grocery-item';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError }                                 from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GroceryService {

    private readonly api = '/api/v1/shopping-list';
    private readonly options = {
        responseType: 'json' as const,
        observe:      'body' as const,
        headers:      new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    private cnt = 0;

    groceriesSubject: BehaviorSubject<GroceryItem[]> = new BehaviorSubject<GroceryItem[]>([]);
    groceries$: Observable<GroceryItem[]> = this.groceriesSubject.asObservable();

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
            .get<GroceryItem[]>(this.api, this.options)
            .subscribe(
                (data: GroceryItem[]) => {
                    console.log('FOOOOOOOOOOO:', data.join(','));
                    this.groceriesSubject.next(data);
                    this.cnt = data.length;
                },
                (error) => GroceryService.handleError(error)
            );
    }

    addGrocery(grocery: GroceryItem): void {
        this.httpClient
            .post<GroceryItem>(this.api, grocery, this.options)
            .pipe(catchError((error) => GroceryService.handleError(error)));
    }

    updateGrocery(grocery: GroceryItem): void {
        this.httpClient
            .get(this.api, this.options)
            .subscribe(
                (data: GroceryItem[]) => {
                    const found = data.find(current => {
                        return current.id === grocery.id;
                    });
                    found.name = grocery.name;

                    this.groceriesSubject.next(data);
                }
            );
    }

}
