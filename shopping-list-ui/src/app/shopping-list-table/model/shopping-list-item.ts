export interface ShoppingListItem {
    readonly id: string;
    name: string;
    amount: number;
    isSelected: boolean;
}

export interface ShoppingListAddItem {
    readonly name: string;
    readonly amount: number;
}
