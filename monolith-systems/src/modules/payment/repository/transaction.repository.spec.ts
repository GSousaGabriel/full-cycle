import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object";
import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction.entity";
import TransactionRepository from "./transaction.repository";

describe("TransactionRepository test", () => {
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

    test("Should save a transaction", async () => {
        const props = {
            id: new Id("1"),
            orderId: "1",
            amount: 100
        }

        const transaction = new Transaction(props)
        transaction.approve()

        const transactionRepository = new TransactionRepository()
        const result = await transactionRepository.save(transaction)

        expect(result.id.id).toBe(props.id.id)
        expect(result.orderId).toBe(props.orderId)
        expect(result.amount).toBe(props.amount)
        expect(result.status).toBe("approved")
    })
})