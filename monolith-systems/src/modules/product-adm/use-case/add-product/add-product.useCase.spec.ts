import AddProductUseCase from "./add-product.useCase"
import { vi } from 'vitest'

const mockRepository = ()=>{
    return{
        add: vi.fn(),
        find: vi.fn()
    }
}


describe("Add product usecase unit test", () => {
    it("Should add a product", async () => {
        const productRepository = mockRepository()
        const useCase = new AddProductUseCase(productRepository)

        const input ={
            name: "product 1",
            description: "product 1 description",
            purchasePrice: 10,
            stock: 10
        }

        const result = await useCase.execute(input)

        expect(productRepository.add).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toBe(input.name)
        expect(result.description).toBe(input.description)
        expect(result.purchasePrice).toBe(input.purchasePrice)
        expect(result.stock).toBe(input.stock)
    })
})