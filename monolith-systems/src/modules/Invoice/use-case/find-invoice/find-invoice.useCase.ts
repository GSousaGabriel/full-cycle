import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDto, FindInvoiceUseCaseOutputDto } from "./find-invoice.dto";

export default class FindInvoiceUseCase {
    constructor(private _invoiceRepository: InvoiceGateway) { }

    async execute(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto> {
        const invoice = await this._invoiceRepository.find(input.id)
        const items = invoice.items.map(item => ({
            id: item.id.id,
            name: item.name,
            price: item.price
        })
        )

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: invoice.address,
            items: items,
            total: invoice.total,
            createdAt: invoice.createdAt,
        }
    }
}