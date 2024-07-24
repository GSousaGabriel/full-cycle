const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}
const mysql = require('mysql')
const connection =  mysql.createConnection(config)

const sqlInsert = `INSERT INTO people(name) values('Gabriel')`
connection.query(sqlInsert)
connection.end()

app.get('/', (req, res)=>{
    res.send('<h1> HEllow</h1>')
})

app.listen(port, ()=>{
    console.log('rodando na porta: ' + port)
})