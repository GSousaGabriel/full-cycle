import { vi } from 'vitest'
import CheckStockProductUseCase from './check-stock.useCase'
import Product from '../../domain/product.entity'
import Id from '../../../@shared/domain/value-object/id.value-object'

const product = new Product({
    id: new Id("1"),
    name: "product 1",
    description: "product 1 description",
    purchasePrice: 10,
    stock: 10
})

const mockRepository = () => {
    return {
        add: vi.fn(),
        find: vi.fn().mockReturnValue(Promise.resolve(product))
    }
}


describe("check stock usecase unit test", () => {
    it("Should check stock of a product", async () => {
        const productRepository = mockRepository()
        const useCase = new CheckStockProductUseCase(productRepository)

        const result = await useCase.execute({ productId: "1" })

        expect(productRepository.find).toHaveBeenCalled()
        expect(result.productId).toBeDefined()
        expect(result.stock).toBe(product.stock)
    })
})