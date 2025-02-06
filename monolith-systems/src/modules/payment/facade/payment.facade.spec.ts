import { Sequelize } from "sequelize-typescript";
import TransactionFacadeFactory from "../factory/facade.factory";
import TransactionModel from "../repository/transaction.model";

describe("PaymentFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        })

        await sequelize.addModels([TransactionModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    test("Should create a transaction", async () => {
        const transactionFacade = TransactionFacadeFactory.create()

        const input = {
            orderId: "1",
            amount: 100
        }

        const output = await transactionFacade.process(input)

        expect(output.transactionId).toBeTruthy()
        expect(output.orderId).toBe(input.orderId)
        expect(output.amount).toBe(input.amount)
        expect(output.status).toBe("approved")
    })
})