import { Injectable }                  from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroceryItem }                 from './model/grocery-item';
import { HttpClient }                  from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GroceryService {

    private cnt: number;

    groceries$: Observable<GroceryItem[]>;
    groceriesSubject = new BehaviorSubject<GroceryItem[]>([]);

    constructor(private httpClient: HttpClient) {
        this.groceries$ = this.groceriesSubject.asObservable();
        this.cnt = 0;
    }

    get count(): number {
        return this.cnt;
    }

    getGroceries(): void {
        this.httpClient
            .get('./assets/pantry.json')
            .subscribe(
                (data: GroceryItem[]) => {
                    this.groceriesSubject.next(data);
                    this.cnt = data.length;
                },
                (error) => console.log(error)
            );
    }

    addGrocery(grocery: GroceryItem): void {
        this.httpClient
            .get('./assets/pantry.json')
            .subscribe(
                (data: GroceryItem[]) => {
                    data.push(grocery);
                    this.groceriesSubject.next(data);

                    this.cnt++;
                },
                (error) => console.log(error));
    }

    updateGrocery(grocery: GroceryItem): void {
        this.httpClient
            .get('./assets/pantry.json')
            .subscribe(
                (data: GroceryItem[]) => {
                    const found = data.find( current => {
                        return current.id === grocery.id;
                    });
                    found.name = grocery.name;

                    this.groceriesSubject.next(data);
                }
            );
    }

}
