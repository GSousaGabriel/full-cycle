import UseCaseInterface from "../../@shared/domain/use-case/useCase.interface";
import ProductAdmFacadeInterface, { addProductFacadeInputDto, checkStockFacadeInputDto, checkStockFacadeOutputDto } from "./product-adm.facade.interface";

export interface UseCaseProps {
    addUseCase: UseCaseInterface;
    checkStockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
    private _addUseCase: UseCaseInterface;
    private _checkStockUseCase: UseCaseInterface;

    constructor(useCaseProps: UseCaseProps) {
        this._addUseCase = useCaseProps.addUseCase
        this._checkStockUseCase = useCaseProps.checkStockUseCase
    }

    addProduct(input: addProductFacadeInputDto): Promise<void> {
        return this._addUseCase.execute(input)
    }

    checkStock(input: checkStockFacadeInputDto): Promise<checkStockFacadeOutputDto> {
        return this._checkStockUseCase.execute(input)
    }
}