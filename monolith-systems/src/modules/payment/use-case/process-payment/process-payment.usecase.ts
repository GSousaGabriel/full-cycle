import UseCaseInterface from "../../../@shared/domain/use-case/useCase.interface";
import Transaction from "../../domain/transaction.entity";
import PaymentGateway from "../../gateway/process-payment.gateway";
import { ProcessPaymentInputDto, ProcessPaymentOutputDto } from "./process-payment.dto";

export default class ProcessPaymentUseCase implements UseCaseInterface {
    constructor(private _transactionRepository: PaymentGateway) { }

    async execute(input: ProcessPaymentInputDto): Promise<ProcessPaymentOutputDto> {
        const transaction = new Transaction({
            orderId: input.orderId,
            amount: input.amount
        })
        transaction.process()

        const persistTransaction = await this._transactionRepository.save(transaction)

        return {
            transactionId: persistTransaction.id.id,
            orderId: persistTransaction.orderId,
            amount: persistTransaction.amount,
            status: transaction.status,
            createdAt: persistTransaction.createdAt,
            updatedAt: persistTransaction.updatedAt,
        }
    }

}