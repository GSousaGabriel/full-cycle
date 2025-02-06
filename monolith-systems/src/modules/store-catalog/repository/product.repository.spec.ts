import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
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

    test("Should find all products", async () => {
        const product = {
            id: "1",
            name: "product 1",
            description: "product 1 description",
            salesPrice: 10,
        }

        const product2 = {
            id: "2",
            name: "product 2",
            description: "product 2 description",
            salesPrice: 101,
        }

        await ProductModel.create(product)
        await ProductModel.create(product2)

        const productRepository = new ProductRepository()
        const products = await productRepository.findAll();

        expect(products.length).toBe(2)
        expect(products[0].id.id).toBe(product.id)
        expect(products[0].name).toBe(product.name)
        expect(products[0].description).toBe(product.description)
        expect(products[0].salesPrice).toBe(product.salesPrice)
        expect(products[1].id.id).toBe(product2.id)
        expect(products[1].name).toBe(product2.name)
        expect(products[1].description).toBe(product2.description)
        expect(products[1].salesPrice).toBe(product2.salesPrice)
    })

    test("Should fnd a product", async () => {
        const product = {
            id: "1",
            name: "product 1",
            description: "product 1 description",
            salesPrice: 10,
        }

        await ProductModel.create(product)

        const productRepository = new ProductRepository()
        const result = await productRepository.find(product.id);

        expect(result.id.id).toBe(product.id)
        expect(result.name).toBe(product.name)
        expect(result.description).toBe(product.description)
        expect(result.salesPrice).toBe(product.salesPrice)
    })
})