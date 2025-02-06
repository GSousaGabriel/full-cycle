import ClientFacade from "../facade/client.facade";
import ClientFacadeInterface from "../facade/client.facade.interface";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../use-case/add-client/add-client.usecase";
import FindClientUseCase from "../use-case/find-client/find-client.usecase";

export default class ClientFacadeFactory {
    static create(): ClientFacadeInterface {
        const clientRepository = new ClientRepository();
        const addUseCase = new AddClientUseCase(clientRepository)
        const findUseCase = new FindClientUseCase(clientRepository)

        const facade = new ClientFacade({
            addUseCase,
            findUseCase
        })

        return facade
    }
}