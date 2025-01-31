import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../domain/customer/value-object/address";
import { inputUpdateCustomerDto, outputUpdateCustomerDto } from "./update.customer.dto";

export default class CustomerUpdateUseCase {
    private customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository
    }

    async execute(input: inputUpdateCustomerDto): Promise<outputUpdateCustomerDto> {
        const customer = await this.customerRepository.find(input.id)
        customer.changeName(input.name)
        customer.changeAddress(new Address(
            input.address.street,
            input.address.number,
            input.address.zip,
            input.address.city
        ))

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.Address.street,
                city: customer.Address.city,
                number: customer.Address.number,
                zip: customer.Address.zip,
            }
        }
    }
}