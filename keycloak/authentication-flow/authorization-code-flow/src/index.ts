import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send("hi there")
})

app.get('/login', (req, res) => {
    const loginParams = new URLSearchParams({
        client_id: "fc-client",
        redirect_uri: "http://localhost:3000/callback",
        response_type: "code",
        scope: "openid"
    })

    const url = `http://localhost:8000/realms/fc-realm/protocol/openid-connect/auth?${loginParams.toString()}`

    res.redirect(url)
})

app.get("/callback", async (req, res) => {
    const bodyParams = new URLSearchParams({
        client_id: "fc-client",
        redirect_uri: "http://localhost:3000/callback",
        grant_type: "authorization_code",
        code: req.query.code as string
    })

    const url = "http://host.docker.internal:8000/realms/fc-realm/protocol/openid-connect/token"

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyParams.toString()
    })

    res.json(await response.json())
})

app.listen(3000, () => {
    console.log("LISTENING ON 3000")
})