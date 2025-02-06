import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/facade.factory";

describe("StoreCatalogFacadeInterface test", () => {
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

    test("Should find a product", async () => {
        const facade = StoreCatalogFacadeFactory.create()
        const product = {
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
          }
        await ProductModel.create(product);

        const result = await facade.find({id: product.id})

        expect(result.id).toBe(product.id)
        expect(result.name).toBe(product.name)
        expect(result.description).toBe(product.description)
        expect(result.salesPrice).toBe(product.salesPrice)
    })

    test("Should find all products", async () => {
        const facade = StoreCatalogFacadeFactory.create()
        const product = {
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
          }
          const product2 = {
              id: "2",
              name: "Product 2",
              description: "Description 2",
              salesPrice: 200,
            }

        await ProductModel.create(product);
        await ProductModel.create(product2);

        const results = await facade.findAll()

        expect(results.products[0].id).toBe(product.id)
        expect(results.products[0].name).toBe(product.name)
        expect(results.products[0].description).toBe(product.description)
        expect(results.products[0].salesPrice).toBe(product.salesPrice)
        expect(results.products[1].id).toBe(product2.id)
        expect(results.products[1].name).toBe(product2.name)
        expect(results.products[1].description).toBe(product2.description)
        expect(results.products[1].salesPrice).toBe(product2.salesPrice)
    })
})