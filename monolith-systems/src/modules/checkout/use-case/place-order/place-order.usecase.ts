import UseCaseInterface from "../../../@shared/domain/use-case/useCase.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import ClientFacadeInterface from "../../../client-adm/facade/client.facade.interface";
import InvoiceFacade from "../../../Invoice/facade/invoice.facade";
import PaymentFacade from "../../../payment/facade/payment.facade";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    private _clientFacade: ClientFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: StoreCatalogFacadeInterface;
    private _repository: CheckoutGateway;
    private _invoiceFacade: InvoiceFacade;
    private _paymentFacade: PaymentFacade;

    constructor(clientFacade: ClientFacadeInterface,
        productFacade: ProductAdmFacadeInterface,
        catalogFacade: StoreCatalogFacadeInterface,
        repository: CheckoutGateway,
        invoiceFacade: InvoiceFacade,
        paymentFacade: PaymentFacade,
    ) {
        this._clientFacade = clientFacade
        this._productFacade = productFacade
        this._catalogFacade = catalogFacade
        this._repository = repository
        this._invoiceFacade = invoiceFacade
        this._paymentFacade = paymentFacade
    }

    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        const client = await this._clientFacade.find({ id: input.clientId })

        if (!client) {
            throw new Error("Client not found")
        }

        await this.validateProducts(input)

        const products = await Promise.all(
            input.products.map(product => this.getProduct(product.productId))
        )

        const myClient = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address.street
        })

        const order = new Order({
            client: myClient,
            products
        })

        const payment = await this._paymentFacade.process({
            orderId: order.id.id,
            amount: order.total
        })

        const invoice = payment.status === "approved" ? await this._invoiceFacade.generateInvoice({
            name: client.name,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode,
            complement: client.address.complement,
            items: products.map(product => ({
                    id: product.id.id,
                    name: product.name,
                    price: product.salesPrice
            }))
        }) : null

        payment.status === "approved" && order.approved()

        this._repository.addOrder(order)

        return {
            id: order.id.id,
            invoiceId: payment.status === "approved" ? invoice.id : null,
            status: order.status,
            total: order.total,
            products: order.products.map(product=>({
                productId: product.id.id
            }))
        }
    }

    private async validateProducts(input: PlaceOrderInputDto) {
        if (input.products.length === 0) throw new Error("No products selected")

        for (const product of input.products) {
            const productStock = await this._productFacade.checkStock({
                productId: product.productId
            })

            if (productStock.stock <= 0) throw new Error(`Product ${product.productId} is not available in stock`)
        }
    }

    private async getProduct(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({ id: productId })

        if (!product) {
            throw new Error("Product not found")
        }

        const productProps = {
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice
        }

        return new Product(productProps)
    }

}