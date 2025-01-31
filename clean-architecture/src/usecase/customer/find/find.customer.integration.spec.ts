import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.useCase";

describe("Integration test find customer case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test("Should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "John")
        const address = new Address("Street", 1, "Zip", "City")
        customer.changeAddress(address)
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
})