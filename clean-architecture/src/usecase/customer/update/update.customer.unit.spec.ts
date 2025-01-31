import { vi } from "vitest";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerUpdateUseCase from "./update.customer.useCase";

const address = new Address(
    "street",
    1,
    "Zip",
    "City"
)
const customer = CustomerFactory.createWithAddress("John", address);

const input = {
    id: customer.id,
    name: customer.name + " Updated",
    address: {
        street: address.street + " Updated",
        city: address.city + " Updated",
        number: address.number + 1,
        zip: address.zip + " Updated"
    }
}

const mockRepository = () => {
    return {
        find: vi.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn()
    }
}

describe("Unit test for customer update use case", () => {
    test("Should update a customer", async () => {
        const customerRepository = mockRepository();
        const customerUpdateUseCase = new CustomerUpdateUseCase(customerRepository)

        const output = await customerUpdateUseCase.execute(input)

        expect(output).toEqual(input)
    })
})