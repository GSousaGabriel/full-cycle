import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe("ProductAdmFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        })

        await sequelize.addModels([ProductModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    test("Should create a product", async () => {
        const productFacade = ProductAdmFacadeFactory.create()

        const input = {
            id: "1",
            name: "product 1",
            description: "product 1 description",
            purchasePrice: 10,
            stock: 10
        }

        await productFacade.addProduct(input)

        const product = await ProductModel.findOne({ where: { id: input.id } })

        expect(product.id).toBe(input.id)
        expect(product.name).toBe(input.name)
        expect(product.description).toBe(input.description)
        expect(product.purchasePrice).toBe(input.purchasePrice)
        expect(product.stock).toBe(input.stock)
    })

    test("Should check the stock of a product", async () => {
        const productFacade = ProductAdmFacadeFactory.create()

        const input = {
            id: "1",
            name: "product 1",
            description: "product 1 description",
            purchasePrice: 10,
            stock: 10
        }

        await productFacade.addProduct(input)
        const stockStatus = await productFacade.checkStock({ productId: input.id })

        expect(stockStatus.productId).toBe(input.id)
        expect(stockStatus.stock).toBe(input.stock)
    })
})