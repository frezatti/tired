export interface ProductData {
    name: string;
    sku: string;
    price: string;
    cost: string;
    quantity: string;
    description: string;
    image: File | null;
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    cost: number;
    quantity: number;
    description?: string ;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
