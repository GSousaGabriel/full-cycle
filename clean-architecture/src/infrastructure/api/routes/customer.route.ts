import express, { json, Request, Response } from "express";
import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.useCase";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";
import CustomerListUseCase from "../../../usecase/customer/list/list.customer.useCase";
import CustomerPresenter from "../presenters/customer.presenter";

export const customerRoute = express.Router()

customerRoute.get("/", async (req: Request, res: Response) => {
    const customerRepository = new CustomerRepository()
    const useCase = new CustomerListUseCase(customerRepository)

    try {
        const output = await useCase.execute({})
        res.format({
            json: async () => res.send(output),
            xml: async () => res.send(CustomerPresenter.listXML(output))
        })
        res.send(output)
    } catch (e) {
        res.status(500).send(e)
    }
})

customerRoute.post("/", async (req: Request, res: Response) => {
    const customerRepository = new CustomerRepository()
    const useCase = new CreateCustomerUseCase(customerRepository)
    try {
        const customerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip
            }
        }

        const output = await useCase.execute(customerDto)
        res.send(output)
    } catch (e) {
        res.status(500).send(e)
    }
})