export interface ShoppingList {
    items: ShoppingListItem[];
}

export interface ShoppingListItem {
    readonly identifier: string;
    name: string;
    amount: number;
    is_selected: boolean;
}

export interface ShoppingListAddItem {
    readonly name: string;
    readonly amount: number;
}

export interface ShoppingListModifyItem {
    readonly identifier: string;
    name: string;
    amount: number;
}
