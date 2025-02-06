import UseCaseInterface from "../../@shared/domain/use-case/useCase.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
    constructor(private _processPaymentUseCase: UseCaseInterface) { }

    process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
        return this._processPaymentUseCase.execute(input)
    }
}