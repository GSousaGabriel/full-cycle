import { vi } from 'vitest'
import Transaction from '../../domain/transaction.entity'
import Id from '../../../@shared/domain/value-object/id.value-object'
import ProcessPaymentUseCase from './process-payment.usecase'

const transaction = new Transaction({
    id: new Id("1"),
    amount: 99,
    orderId: "1"
})

const mockRepository = () => {
    return {
        save: vi.fn().mockReturnValue(Promise.resolve(transaction))
    }
}


describe("Add payment usecase unit test", () => {
    it("Should add a payment", async () => {
        const paymentRepository = mockRepository()
        const useCase = new ProcessPaymentUseCase(paymentRepository)

        const input = {
            orderId: "1",
            amount: 100,
        }

        const result = await useCase.execute(input)

        expect(paymentRepository.save).toHaveBeenCalled()
        expect(result.transactionId).toBe(transaction.id.id)
        expect(result.orderId).toBe(input.orderId)
        expect(result.status).toBe("approved")
        expect(result.amount).toBe(transaction.amount)
    })
})