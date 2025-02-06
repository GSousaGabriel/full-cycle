import ProductGateway from "../../gateway/product.gateway";
import { CheckStockInputProductDto, CheckStockOutputProductDto } from "./check-stock.dto";

export default class CheckStockProductUseCase {
    private _productRepository: ProductGateway;

    constructor(productRepository: ProductGateway) {
        this._productRepository = productRepository
    }

    async execute(input: CheckStockInputProductDto): Promise<CheckStockOutputProductDto> {
        const product = await this._productRepository.find(input.productId)

        return {
            productId: product.id.id,
            stock: product.stock
        }
    }
}