import { vi } from "vitest"
import CreateCustomerUseCase from "./create.customer.useCase"

const input = {
    name: "John",
    address: {
        street: "Street",
        city: "City",
        number: 1,
        zip: "Zip"
    }
}

const mockRepository = () => {
    return {
        find: vi.fn(),
        findAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn()
    }
}

describe("Unit test create customer use case", () => {
    test("Should create a customer", async () => {
        const customerRepository = mockRepository()
        const customerCreateUseCase = new CreateCustomerUseCase(customerRepository)
        const output = await customerCreateUseCase.execute(input)

        expect(output).toEqual({
            id: expect.any(String),
            ...input
        })
    })

    test("Should throw an error when name is missing", async () => {
        const customerRepository = mockRepository()
        const customerCreateUseCase = new CreateCustomerUseCase(customerRepository)

        await expect(customerCreateUseCase.execute({ ...input, name: "" })).rejects.toThrow("Name is required")
    })

    test("Should throw an error when street is missing", async () => {
        const customerRepository = mockRepository()
        const customerCreateUseCase = new CreateCustomerUseCase(customerRepository)

        await expect(customerCreateUseCase.execute({ ...input, address: { ...input.address, street: "" } })).rejects.toThrow("Street is required")
    })
})