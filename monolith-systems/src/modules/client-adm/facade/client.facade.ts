import UseCaseInterface from "../../@shared/domain/use-case/useCase.interface";
import ClientFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client.facade.interface";

export interface UseCaseProps {
    addUseCase: UseCaseInterface;
    findUseCase: UseCaseInterface;
}

export default class ClientFacade implements ClientFacadeInterface {
    private _addUseCase: UseCaseInterface;
    private _findUseCase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps) {
        this._addUseCase = useCaseProps.addUseCase
        this._findUseCase = useCaseProps.findUseCase
    }

    add(input: AddClientFacadeInputDto): Promise<void> {
        return this._addUseCase.execute(input)
    }

    find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
        return this._findUseCase.execute(input)
    }
}