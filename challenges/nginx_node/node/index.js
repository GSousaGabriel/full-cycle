const express = require('express')
const app = express()
const port = 5000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}
const mysql = require('mysql')
const { randomNameGenerator } = require('./util/randomNameGenerator')
const connection = mysql.createConnection(config)

const validateTable = (cb) => {
    const sqlTableValidator = `CREATE TABLE IF NOT EXISTS people(id int not null auto_increment, name varchar(255), primary key(id))`
    connection.query(sqlTableValidator)
}

const insertIntoTable = (cb) => {
    const name = randomNameGenerator()
    const sqlInsert = `INSERT INTO people(name) values('${name}')`
    connection.query(sqlInsert, ()=>{
        cb()
    })
}

const getFromTable = (cb) => {
    const sqlGetNomes = `SELECT id, name FROM people`
    connection.query(sqlGetNomes, (error, results) => {
        if (error) {
            throw error
        }
        cb(results)
    })
}

const getHtmlCode = (people) => {
    const html = `
    <h1>Full Cycle Rocks!</h1>
    <br/>
    <h1>Lista de nomes cadastrada no banco de dados:</h1>
    ${listPeople(people)}
    `
    return html
}

const listPeople = (people) => {
    let html = '<ul>'

    for (person of people) {
        html += `<li>${person.id} - ${person.name}</li>`
    }

    html += '</ul>'
    return html
}

app.get('/', (req, res) => {
    insertIntoTable(()=>{
        getFromTable((response) => {
            const html = getHtmlCode(response)
            res.send(html)
        })
    })
})

app.listen(port, () => {
    validateTable()
    console.log('rodando na porta: ' + port)
})