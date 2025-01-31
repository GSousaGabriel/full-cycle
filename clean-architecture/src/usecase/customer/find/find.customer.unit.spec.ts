import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.useCase";
import { vi } from "vitest";

const customer = new Customer("123", "John")
const address = new Address("Street", 1, "Zip", "City")
customer.changeAddress(address)

const mockRepository = () => {
    return {
        find: vi.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn()
    }
}

describe("Unit test find customer case", () => {
    test("Should find a customer", async () => {
        const customerRepository = mockRepository();
        const input = { id: "123" }
        const output = {
            id: "123",
            name: "John",
            address: {
                street: "Street",
                city: "City",
                number: 1,
                zip: "Zip"
            }
        }

        await customerRepository.create(customer)
        const useCase = new FindCustomerUseCase(customerRepository)
        const result = await useCase.execute(input)

        expect(result).toEqual(output)
    })

    test("Should not find a customer", async () => {
        const customerRepository = mockRepository();
        customerRepository.find.mockImplementation(() => {
            throw new Error("Customer not found");
        })
        const input = { id: "123" }
        const useCase = new FindCustomerUseCase(customerRepository)

        expect(() => {
            return useCase.execute(input)
        }).rejects.toThrow("Customer not found")
    })
})