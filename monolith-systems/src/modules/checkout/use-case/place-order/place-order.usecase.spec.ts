import { vi } from "vitest"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import PlaceOrderUseCase from "./place-order.usecase"
import { PlaceOrderInputDto } from "./place-order.dto"

const product = new Product({
    id: new Id("1"),
    name: "product 1",
    description: "product 1 description",
    salesPrice: 10,
})

const product2 = new Product({
    id: new Id("2"),
    name: "product 2",
    description: "product 2 description",
    salesPrice: 101,
})
const mockDate = new Date(2000, 1, 1)

describe("PlaceOrderUseCase test", () => {
    describe("validadeProducts method", () => {
        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase()

        test("Should throw an error if no products are selected", async () => {
            const mockClientFacade = {
                find: vi.fn().mockResolvedValue(true),
            }
            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade
            const input: PlaceOrderInputDto = { clientId: "0", products: [] };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(new Error("No products selected"))
        })

        test("Should throw an error if product is out of stock", async () => {
            const mockProductFacade = {
                checkStock: vi.fn(({ productId }: { productId: string }) =>
                    Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1
                    }))
            }
            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade

            let input: PlaceOrderInputDto = { clientId: "0", products: [{ productId: "1" }] };
            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(new Error("Product 1 is not available in stock"))

            input = { clientId: "0", products: [{ productId: "0" }, { productId: "1" }] };
            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(new Error("Product 1 is not available in stock"))

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

            input = { clientId: "0", products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }] };
            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(new Error("Product 1 is not available in stock"))

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)
        })
    })

    describe("getProducts method", () => {
        beforeAll(() => {
            vi.useFakeTimers()
            vi.setSystemTime(mockDate)
        })

        afterAll(() => {
            vi.useRealTimers()
        })

        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase()

        test("Should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: vi.fn().mockResolvedValue(null)
            }

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade

            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(new Error("Product not found"))

        })

        test("Should throw an error when product not found", async () => {
            const product = {
                id: "0",
                name: "product",
                description: "product description",
                salesPrice: 10
            }
            const mockCatalogFacade = {
                find: vi.fn().mockResolvedValue(product)
            }

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade

            await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
                new Product({
                    id: new Id(product.id),
                    name: product.name,
                    description: product.description,
                    salesPrice: product.salesPrice
                })
            )
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1)
        })
    })

    describe("execute method", () => {
        beforeAll(() => {
            vi.useFakeTimers()
            vi.setSystemTime(mockDate)
        })

        afterAll(() => {
            vi.useRealTimers()
        })

        test("Should throw an error when client not found", async () => {
            const mockClientFacade = {
                find: vi.fn().mockResolvedValue(null),
            }

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase()
            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade

            const input: PlaceOrderInputDto = { clientId: "0", products: [] };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(new Error("Client not found"))
        })

        test("Should throw an error when products are not valid", async () => {
            const mockClientFacade = {
                find: vi.fn().mockResolvedValue(true),
            }

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase()
            const mockValidadeProducts = vi
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                .mockRejectedValue(new Error("No products selected"));

            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade

            const input: PlaceOrderInputDto = { clientId: "1", products: [] };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(new Error("No products selected"))
            expect(mockValidadeProducts).toHaveBeenCalledTimes(1)
        })

        describe("place an order", () => {
            const clientProps = {
                id: "1",
                name: "client",
                document: "document",
                email: "email@email",
                address: {
                    street: "street",
                    number: "1",
                    complement: "",
                    city: "city",
                    state: "state",
                    zipCode: "zipCode"
                }
            }

            const mockClientFacade = {
                find: vi.fn().mockResolvedValue(clientProps),
            }

            const mockPaymentFacade = {
                process: vi.fn(),
            }

            const mockCheckoutRepository = {
                addOrder: vi.fn(),
            }

            const mockInvoiceFacade = {
                generateInvoice: vi.fn().mockResolvedValue({ id: "1" }),
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null,
                null,
                mockCheckoutRepository as any,
                mockInvoiceFacade as any,
                mockPaymentFacade as any
            )

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "product 1",
                    description: "product 1 description",
                    salesPrice: 10,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "product 2",
                    description: "product 2 description",
                    salesPrice: 101,
                })
            }

            const mockValidadeProducts = vi
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - spy on private method
                .mockResolvedValue(null);

            const mockGetProduct = vi
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                //@ts-expect-error - spy on private method
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId]
                });

            test("Should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1",
                    orderId: "1",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                const input: PlaceOrderInputDto = {
                    clientId: "1",
                    products: [{ productId: "1" }, { productId: "2" }]
                }

                let output = await placeOrderUseCase.execute(input)

                expect(output.invoiceId).toBeNull()
                expect(output.total).toBe(111)
                expect(output.products).toStrictEqual([{ productId: "1" }, { productId: "2" }])
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1" })
                expect(mockValidadeProducts).toHaveBeenCalledWith(input)
                expect(mockGetProduct).toHaveBeenCalledTimes(2)
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                })
                expect(mockInvoiceFacade.generateInvoice).not.toHaveBeenCalled()
            })

            test("should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1",
                    orderId: "1",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                const input: PlaceOrderInputDto = {
                    clientId: "1",
                    products: [{ productId: "1" }, { productId: "2" }]
                }

                let output = await placeOrderUseCase.execute(input)

                expect(output.invoiceId).toBe("1")
                expect(output.total).toBe(111)
                expect(output.products).toStrictEqual([{ productId: "1" }, { productId: "2" }])
                expect(mockClientFacade.find).toHaveBeenCalledTimes(2)
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1" })
                expect(mockGetProduct).toHaveBeenCalledTimes(4)
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(2)
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(2)
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                })
                expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(1)
                expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.address.street,
                    number: clientProps.address.number,
                    complement: clientProps.address.complement,
                    city: clientProps.address.city,
                    state: clientProps.address.state,
                    zipCode: clientProps.address.zipCode,
                    items: [{
                        id: products["1"].id.id,
                        name: products["1"].name,
                        price: products["1"].salesPrice,
                    }, {
                        id: products["2"].id.id,
                        name: products["2"].name,
                        price: products["2"].salesPrice,
                    }]
                })
            })
        })
    })
})