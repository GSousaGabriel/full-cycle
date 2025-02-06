import { vi } from 'vitest'
import GenerateInvoiceUseCase from './generate-invoice.useCase'

const mockRepository = () => {
    return {
        generate: vi.fn(),
        find: vi.fn()
    }
}

describe("Generate invoice usecase unit test", () => {
    it("Should generate an invoice", async () => {
        const invoiceRepository = mockRepository()
        const useCase = new GenerateInvoiceUseCase(invoiceRepository)

        const address = {
            street: "street",
            number: "number",
            complement: "complement",
            city: "city",
            state: "state",
            zipCode: "zipCode",
        }
        const item1 = {
            id: "1",
            name: "product 1",
            price: 10
        }
        const item2 = {
            id: "2",
            name: "product 2",
            price: 20
        }
        const invoice = {
            name: "invoice 1",
            document: "document 1",
            ...address,
            items: [item1, item2]
        }

        const result = await useCase.execute(invoice)

        expect(invoiceRepository.generate).toHaveBeenCalled()
        expect(result.id).toBeTruthy()
        expect(result.name).toBe(invoice.name)
        expect(result.document).toBe(invoice.document)
        expect(result.items.length).toBe(2)
        expect(result.street).toBe(address.street)
        expect(result.state).toBe(address.state)
        expect(result.city).toBe(address.city)
        expect(result.complement).toBe(address.complement)
        expect(result.number).toBe(address.number)
        expect(result.zipCode).toBe(address.zipCode)
        expect(result.items[0].name).toBe(item1.name)
        expect(result.items[0].price).toBe(item1.price)
        expect(result.items[1].name).toBe(item2.name)
        expect(result.items[1].price).toBe(item2.price)
    })
})