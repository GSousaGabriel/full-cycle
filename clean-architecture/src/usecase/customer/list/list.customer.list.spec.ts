import { vi } from "vitest";
import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import CustomerListUseCase from "./list.customer.useCase";

const address1 = new Address(
    "street",
    1,
    "Zip",
    "City"
)
const address2 = new Address(
    "street 2",
    2,
    "Zip 2",
    "City 2"
)
const customer1 = CustomerFactory.createWithAddress("John", address1)
const customer2 = CustomerFactory.createWithAddress("John2", address2)

const mockRepository = () => {
    return {
        find: vi.fn(),
        findAll: vi.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
        create: vi.fn(),
        update: vi.fn()
    }
}

describe("Unit test for list customer use case", () => {
    test("Should list a customer", async () => {
        const customerRepository = mockRepository();
        const customerUpdateUseCase = new CustomerListUseCase(customerRepository)

        const output = await customerUpdateUseCase.execute({})

        expect(output.customers.length).toBe(2)
        expect(output.customers[0].name).toEqual(customer1.name)
        expect(output.customers[0].address.street).toEqual(address1.street)
        expect(output.customers[1].name).toEqual(customer2.name)
        expect(output.customers[1].address.street).toEqual(address2.street)
    })
})