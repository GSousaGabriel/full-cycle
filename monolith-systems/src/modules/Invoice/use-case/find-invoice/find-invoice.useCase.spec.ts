import { vi } from 'vitest'
import Id from '../../../@shared/domain/value-object/id.value-object'
import Invoice from '../../domain/invoice.entity'
import Address from '../../domain/address.entity'
import InvoiceItem from '../../domain/invoice-item.entity'
import FindInvoiceUseCase from './find-invoice.useCase'

const address = new Address({
    street: "street",
    number: "number",
    complement: "complement",
    city: "city",
    state: "state",
    zipCode: "zipCode",
})

const item1 = new InvoiceItem({
    name: "product 1",
    price: 10
})

const item2 = new InvoiceItem({
    name: "product 2",
    price: 20
})

const invoice = new Invoice({
    id: new Id("1"),
    name: "invoice 1",
    document: "document 1",
    address: address,
    items: [item1, item2]
})

const mockRepository = () => {
    return {
        generate: vi.fn(),
        find: vi.fn().mockReturnValue(Promise.resolve(invoice))
    }
}


describe("find invoice usecase unit test", () => {
    it("Should find a invoice", async () => {
        const invoiceRepository = mockRepository()
        const useCase = new FindInvoiceUseCase(invoiceRepository)

        const result = await useCase.execute({ id: "1" })

        expect(invoiceRepository.find).toHaveBeenCalled()
        expect(result.id).toBe(invoice.id.id)
        expect(result.name).toBe(invoice.name)
        expect(result.document).toBe(invoice.document)
        expect(result.items.length).toBe(2)
        expect(result.address.street).toBe(address.street)
        expect(result.address.state).toBe(address.state)
        expect(result.address.city).toBe(address.city)
        expect(result.address.complement).toBe(address.complement)
        expect(result.address.number).toBe(address.number)
        expect(result.address.zipCode).toBe(address.zipCode)
        expect(result.items[0].name).toBe(item1.name)
        expect(result.items[0].price).toBe(item1.price)
        expect(result.items[1].name).toBe(item2.name)
        expect(result.items[1].price).toBe(item2.price)
    })
})