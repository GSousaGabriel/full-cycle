import express from 'express'
import session from "express-session";
import jwt from "jsonwebtoken";
import crypto from "crypto"

const app = express()
app.use(express.urlencoded({ extended: true }))

const memoryStore = new session.MemoryStore();

app.use(
    session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: false,
        store: memoryStore,
        //expires
    })
);

app.get('/', (req, res) => {
    res.send("hi there")
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + "/login.html")
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const response = await fetch(
        "http://host.docker.internal:8000/realms/fc-realm/protocol/openid-connect/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: "fc-client",
                grant_type: "password",
                username,
                password,
                scope: "openid",
            }).toString(),
        }
    );

    const result = await response.json();
    console.log(result);
    //@ts-expect-error - type mismatch
    req.session.user = result;
    req.session.save();

    res.redirect("/admin");
});

app.get('/logout', async (req, res) => {
    await fetch(
        "http://host.docker.internal:8080/realms/fullcycle-realm/protocol/openid-connect/revoke",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: "fullcycle-client",
            //@ts-expect-error
            token: req.session.user.refresh_token,
          }).toString(),
        }
      );
      //response.ok verificar se a resposta está ok
      req.session.destroy((err) => {
        console.error(err);
      });
      res.redirect("/login");
})

app.get("/callback", async (req, res) => {

    //@ts-expect-error - type mismatch
    if (req.session.user) {
        return res.redirect("/admin")
    }

    //@ts-expect-error - type mismatch
    if (req.session.state !== req.session.state) {
        res.status(401).json({ message: "Unauthenticated" });
    }


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

    const result = await response.json()

    console.log(result);
    const payloadAccessToken = jwt.decode(result.access_token) as any;
    const payloadRefreshToken = jwt.decode(result.refresh_token) as any;
    const payloadIdToken = jwt.decode(result.id_token) as any;

    if (
        //@ts-expect-error - type mismatch
        payloadAccessToken!.nonce !== req.session.nonce ||
        //@ts-expect-error - type mismatch
        payloadRefreshToken.nonce !== req.session.nonce ||
        //@ts-expect-error - type mismatch
        payloadIdToken.nonce !== req.session.nonce
    ) {
        res.status(401).json({ message: "Unauthenticated" });
    }

    console.log(payloadAccessToken);
    //@ts-expect-error - type mismatch
    req.session.user = payloadAccessToken;
    //@ts-expect-error - type mismatch
    req.session.access_token = result.access_token;
    //@ts-expect-error - type mismatch
    req.session.id_token = result.id_token;
    req.session.save();
    res.json(result);
})

app.listen(3000, () => {
    console.log("LISTENING ON 3000")
})