import type { Ingredient, HPPState } from "./types";

export const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);

export const newIngredient = (): Ingredient => ({
    id: Math.random().toString(36).slice(2),
    name: "",
    unit: "",
    price: 0,
});

export const EXAMPLE_HPP: HPPState = {
    productName: "Es Teh Manis",
    ingredients: [
        { id: "1", name: "Teh celup", unit: "1 box (25 pcs)", price: 12500 },
        { id: "2", name: "Gula pasir", unit: "1 kg", price: 15000 },
        { id: "3", name: "Air mineral", unit: "1 galon", price: 20000 },
        { id: "4", name: "Gelas + sedotan", unit: "100 pcs", price: 25000 },
    ],
    laborCostPerUnit: 200,
    overheadCostPerUnit: 200,
    quantity: 100,
};
