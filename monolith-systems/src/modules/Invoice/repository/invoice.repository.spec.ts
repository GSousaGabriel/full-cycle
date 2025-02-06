import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import ItemModel from "./item.model";
import Invoice from "../domain/invoice.entity";
import Address from "../domain/address.entity";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceRepository from "./invoice.repository";

describe("ProductRepository test", () => {
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

    test("Should generate an invoice", async () => {
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
        const props = {
            name: "invoice 1",
            document: "document 1",
            address,
            items: [item1, item2]
        }

        const invoice = new Invoice(props)
        const invoiceRepository = new InvoiceRepository()
        await invoiceRepository.generate(invoice)

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: [ItemModel]
        })

        expect(invoiceDb.id).toBe(invoice.id.id)
        expect(invoiceDb.name).toBe(invoice.name)
        expect(invoiceDb.document).toBe(invoice.document)
        expect(invoiceDb.items.length).toBe(2)
        expect(invoiceDb.street).toBe(address.street)
        expect(invoiceDb.state).toBe(address.state)
        expect(invoiceDb.city).toBe(address.city)
        expect(invoiceDb.complement).toBe(address.complement)
        expect(invoiceDb.number).toBe(address.number)
        expect(invoiceDb.zipCode).toBe(address.zipCode)
        expect(invoiceDb.items[0].name).toBe(item1.name)
        expect(invoiceDb.items[0].price).toBe(item1.price)
        expect(invoiceDb.items[1].name).toBe(item2.name)
        expect(invoiceDb.items[1].price).toBe(item2.price)
    })

    test("Should find an invoice", async () => {
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
        const props = {
            id: "1",
            name: "invoice 1",
            document: "document 1",
            ...address,
            items: [item1, item2],
            createdAt: new Date()
        }

        const invoiceRepository = new InvoiceRepository()

        await InvoiceModel.create(props, { include: [ItemModel] })
        const invoice = await invoiceRepository.find("1")

        expect(invoice.id.id).toBeTruthy()
        expect(invoice.name).toBe(props.name)
        expect(invoice.document).toBe(invoice.document)
        expect(invoice.items.length).toBe(2)
        expect(invoice.address.street).toBe(address.street)
        expect(invoice.address.state).toBe(address.state)
        expect(invoice.address.city).toBe(address.city)
        expect(invoice.address.complement).toBe(address.complement)
        expect(invoice.address.number).toBe(address.number)
        expect(invoice.address.zipCode).toBe(address.zipCode)
        expect(invoice.items[0].name).toBe(item1.name)
        expect(invoice.items[0].price).toBe(item1.price)
        expect(invoice.items[1].name).toBe(item2.name)
        expect(invoice.items[1].price).toBe(item2.price)
    })
})