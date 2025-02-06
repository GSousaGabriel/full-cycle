import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../use-case/find-invoice/find-invoice.useCase";
import GenerateInvoiceUseCase from "../use-case/generate-invoice/generate-invoice.useCase";

export default class InvoiceFacadeFactory {
    static create() {
        const invoiceRepository = new InvoiceRepository();
        const findProductUseCase = new FindInvoiceUseCase(invoiceRepository)
        const generateProductUseCase = new GenerateInvoiceUseCase(invoiceRepository)
        const invoiceFacade = new InvoiceFacade({
            generateUseCase: generateProductUseCase,
            findUseCase: findProductUseCase
        })

        return invoiceFacade
    }
}