import { Injectable }  from '@angular/core';
import { Observable }  from 'rxjs';
import { of }          from 'rxjs';
import { GroceryItem } from './model/grocery-item';

@Injectable({ providedIn: 'root' })
export class GroceryService {

    constructor() {
    }

    getGroceries(): Observable<GroceryItem[]> {
        return of(
            [
                {
                    name:   'fisch',
                    amount: 1
                },
                {
                    name:   'Ei',
                    amount: 10
                },
                {
                    name:   'Milch',
                    amount: 2
                }
            ]
        );
    }

}
