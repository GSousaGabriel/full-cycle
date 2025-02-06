import UseCaseInterface from "../../@shared/domain/use-case/useCase.interface";
import { FindInvoiceUseCaseInputDto, FindInvoiceUseCaseOutputDto } from "../use-case/find-invoice/find-invoice.dto";
import { GenerateInvoiceUseCaseInputDto } from "../use-case/generate-invoice/generate-invoice.dto";
import InvoiceFacadeInterface, { GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    generateUseCase: UseCaseInterface;
    findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _generateUseCase: UseCaseInterface;
    private _findUseCase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps) {
        this._generateUseCase = useCaseProps.generateUseCase
        this._findUseCase = useCaseProps.findUseCase
    }

    generateInvoice(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return this._generateUseCase.execute(input)
    }

    find(input: FindInvoiceUseCaseInputDto): Promise<FindInvoiceUseCaseOutputDto> {
        return this._findUseCase.execute(input)
    }
}