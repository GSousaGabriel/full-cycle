import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true })
    })

    afterAll(async () => {
        await sequelize.close()
    })

    test("Should create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "Street",
                    city: "City",
                    number: 123,
                    zip: "12345"
                }
            })

        expect(response.status).toBe(200)
        expect(response.body.name).toBe("John")
        expect(response.body.address.street).toBe("Street")
        expect(response.body.address.city).toBe("City")
        expect(response.body.address.number).toBe(123)
        expect(response.body.address.zip).toBe("12345")
    })

    test("Should not create a customer", async () => {
        const response = await request(app)
            .post("/customer")
            .send({
                name: "John"
            })

        expect(response.status).toBe(500)
    })

    test("Should list all customers", async () => {
        await request(app)
            .post("/customer")
            .send({
                name: "Roger",
                address: {
                    street: "Street 2",
                    city: "City 2",
                    number: 1234,
                    zip: "123456"
                }
            })

        const responseGet = await request(app).get("/customer").send()

        expect(responseGet.status).toBe(200)
        expect(responseGet.body.customers.length).toBe(2)
        expect(responseGet.body.customers[0].name).toBe("John")
        expect(responseGet.body.customers[0].address.street).toBe("Street")
        expect(responseGet.body.customers[1].name).toBe("Roger")
        expect(responseGet.body.customers[1].address.street).toBe("Street 2")

        const listResponseXML = await request(app)
        .get("/customer")
        .set("Accept", "application/xml")
        .send()

        expect(listResponseXML.status).toBe(200)
        expect(listResponseXML.text).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    })
})