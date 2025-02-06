import { vi } from "vitest"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import FindProductUseCase from "./find-product.usecase"

const product = new Product({
    id: new Id("1"),
    name: "product 1",
    description: "product 1 description",
    salesPrice: 10,
})

const mockRepository = () => {
    return {
        find: vi.fn().mockReturnValue(Promise.resolve(product)),
        findAll: vi.fn()
    }
}

describe("FindProductUseCase test", () => {
    test("Should find a product", async () => {
        const productRepository = mockRepository()
        const findProductUseCase = new FindProductUseCase(productRepository)

        const result = await findProductUseCase.execute({ id: product.id.id })

        expect(productRepository.find).toHaveBeenCalled()
        expect(result.id).toBe(product.id.id)
        expect(result.name).toBe(product.name)
        expect(result.description).toBe(product.description)
        expect(result.salesPrice).toBe(product.salesPrice)
    })
})