import Customer from "../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import { inputListCustomerDto, outputListCustomerDto } from "./list.customer.dto";

export default class CustomerListUseCase {
    private customerRepository: CustomerRepositoryInterface;

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository
    }

    async execute(input: inputListCustomerDto): Promise<outputListCustomerDto> {
        const customers = await this.customerRepository.findAll();
        return outputMapper.toOutput(customers)
    }
}

class outputMapper {
    static toOutput(customer: Customer[]): outputListCustomerDto {
        return {
            customers: customer.map((customer) => ({
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.Address.street,
                    city: customer.Address.city,
                    number: customer.Address.number,
                    zip: customer.Address.zip,
                }
            }))
        }
    }
}