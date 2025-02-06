import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import ItemModel from "../repository/item.model";
import InvoiceFacadeFactory from "../factory/facade.factory";

describe("ProductAdmFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        })

        await sequelize.addModels([InvoiceModel, ItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    test("Should find an invoice", async () => {
        const invoiceFacade = InvoiceFacadeFactory.create()

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
        const input = {
            id: "1",
            name: "invoice 1",
            document: "document 1",
            ...address,
            items: [item1, item2],
            createdAt: new Date()
        }

        const invoice = await InvoiceModel.create(input, { include: [ItemModel] })
        const response = await invoiceFacade.find({ id: invoice.id })

        expect(response.id).toBe(invoice.id)
        expect(response.name).toBe(input.name)
        expect(response.document).toBe(input.document)
        expect(response.items.length).toBe(2)
        expect(response.address.street).toBe(address.street)
        expect(response.address.state).toBe(address.state)
        expect(response.address.city).toBe(address.city)
        expect(response.address.complement).toBe(address.complement)
        expect(response.address.number).toBe(address.number)
        expect(response.address.zipCode).toBe(address.zipCode)
        expect(response.items[0].name).toBe(item1.name)
        expect(response.items[0].price).toBe(item1.price)
        expect(response.items[1].name).toBe(item2.name)
        expect(response.items[1].price).toBe(item2.price)
    })

    test("Should generate an invoice", async () => {
        const productFacade = InvoiceFacadeFactory.create()

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
        const input = {
            name: "invoice 1",
            document: "document 1",
            ...address,
            items: [item1, item2]
        }

        const invoice = await productFacade.generateInvoice(input)
        const result = await InvoiceModel.findOne({ where: { id: invoice.id }, include: [ItemModel] })

        expect(result.id).toBe(invoice.id)
        expect(result.name).toBe(invoice.name)
        expect(result.document).toBe(invoice.document)
        expect(result.items.length).toBe(2)
        expect(result.street).toBe(invoice.street)
        expect(result.state).toBe(invoice.state)
        expect(result.city).toBe(invoice.city)
        expect(result.complement).toBe(invoice.complement)
        expect(result.number).toBe(invoice.number)
        expect(result.zipCode).toBe(invoice.zipCode)
        expect(result.items[0].name).toBe(invoice.items[0].name)
        expect(result.items[0].price).toBe(invoice.items[0].price)
        expect(result.items[1].name).toBe(invoice.items[1].name)
        expect(result.items[1].price).toBe(invoice.items[1].price)
    })
})