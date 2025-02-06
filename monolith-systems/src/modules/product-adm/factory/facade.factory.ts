import ProductAdmFacade from "../facade/product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../use-case/add-product/add-product.useCase";
import CheckStockProductUseCase from "../use-case/check-stock/check-stock.useCase";

export default class ProductAdmFacadeFactory {
    static create() {
        const productRepository = new ProductRepository();
        const addProductUseCase = new AddProductUseCase(productRepository)
        const checkStockProductUseCase = new CheckStockProductUseCase(productRepository)
        const prodcutFacade = new ProductAdmFacade({
            addUseCase: addProductUseCase,
            checkStockUseCase: checkStockProductUseCase
        })

        return prodcutFacade
    }
}