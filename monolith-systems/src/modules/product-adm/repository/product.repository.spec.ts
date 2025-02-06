import { Sequelize } from "sequelize-typescript"
import ProductModel from "./product.model"
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("ProductRepository test", () => {
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
        const props = {
            id: new Id("1"),
            name: "product 1",
            description: "product 1 description",
            purchasePrice: 10,
            stock: 10
        }

        const product = new Product(props)
        const productRepository = new ProductRepository()
        await productRepository.add(product)

        const productDb = await ProductModel.findOne({
            where: { id: props.id.id }
        })

        expect(productDb.id).toBe(props.id.id)
        expect(productDb.name).toBe(props.name)
        expect(productDb.description).toBe(props.description)
        expect(productDb.purchasePrice).toBe(props.purchasePrice)
        expect(productDb.stock).toBe(props.stock)
    })

    test("Should find a product", async () => {
        const input = {
            id: "1",
            name: "product 1",
            description: "product 1 description",
            purchasePrice: 10,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const productRepository = new ProductRepository()

        await ProductModel.create(input)
        const product = await productRepository.find("1")

        expect(product.id.id).toBe(input.id)
        expect(product.name).toBe(input.name)
        expect(product.description).toBe(input.description)
        expect(product.purchasePrice).toBe(input.purchasePrice)
        expect(product.stock).toBe(input.stock)
    })
})