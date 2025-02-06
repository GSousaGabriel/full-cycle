export interface CheckStockInputProductDto {
    productId: string;
}

export interface CheckStockOutputProductDto {
    productId: string;
    stock: number;
}