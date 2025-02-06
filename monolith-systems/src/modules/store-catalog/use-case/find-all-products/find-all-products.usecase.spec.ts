import { vi } from "vitest"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import FindAllProductsUseCase from "./find-all-products.usecase"

const product = new Product({
    id: new Id("1"),
    name: "product 1",
    description: "product 1 description",
    salesPrice: 10,
})

const product2 = new Product({
    id: new Id("2"),
    name: "product 2",
    description: "product 2 description",
    salesPrice: 101,
})

const mockRepository = () => {
    return {
        find: vi.fn(),
        findAll: vi.fn().mockReturnValue(Promise.resolve([product, product2]))
    }
}

describe("FindAllProductsUseCase test", () => {
    test("Should find all products", async () => {
        const productRepository = mockRepository()
        const findAllProductsUseCase = new FindAllProductsUseCase(productRepository)

        const result = await findAllProductsUseCase.execute()

        expect(productRepository.findAll).toHaveBeenCalled()
        expect(result.products.length).toBe(2)
        expect(result.products[0].id).toBe(product.id.id)
        expect(result.products[0].name).toBe(product.name)
        expect(result.products[0].description).toBe(product.description)
        expect(result.products[0].salesPrice).toBe(product.salesPrice)
        expect(result.products[1].id).toBe(product2.id.id)
        expect(result.products[1].name).toBe(product2.name)
        expect(result.products[1].description).toBe(product2.description)
        expect(result.products[1].salesPrice).toBe(product2.salesPrice)
    })
})