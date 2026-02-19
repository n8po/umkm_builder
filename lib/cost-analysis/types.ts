export interface Ingredient {
    id: string;
    name: string;
    unit: string;
    price: number;
}

export interface HPPState {
    productName: string;
    ingredients: Ingredient[];
    laborCostPerUnit: number;
    overheadCostPerUnit: number;
    quantity: number;
}

export interface HPPResult {
    totalBahan: number;
    totalOps: number;
    hppPerUnit: number;
}

export interface BEPState {
    hppPerUnit: number;
    rentCost: number;
    salariesCost: number;
    utilitiesCost: number;
    marketingCost: number;
    sellingPrice: number;
}
