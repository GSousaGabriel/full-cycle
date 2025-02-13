package database

import (
	"database/sql"
	"testing"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/entity"
	"github.com/stretchr/testify/suite"
)

type TransactionDBTestSuite struct {
	suite.Suite
	db            *sql.DB
	client        *entity.Client
	client2       *entity.Client
	accountFrom   *entity.Account
	accountTo     *entity.Account
	transactionDB *TransactionDB
}

func (t *TransactionDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	t.Nil(err)
	t.db = db
	db.Exec("CREATE TABLE clients (id TEXT, name TEXT, email TEXT, created_at DATETIME)")
	db.Exec("CREATE TABLE accounts (id TEXT, client_id TEXT, balance float, created_at DATETIME)")
	db.Exec("CREATE TABLE transactions (id TEXT, account_from_id TEXT, account_to_id TEXT, amount float, created_at DATETIME)")
	client, _ := entity.NewClient("John Doe", "email@email.com")
	t.Nil(err)

	t.client = client

	client2, _ := entity.NewClient("John Doe 2", "email2@email.com")
	t.Nil(err)
	t.client2 = client2

	t.accountFrom = entity.NewAccount(client)
	t.accountFrom.Credit(100)
	t.accountTo = entity.NewAccount(client2)
	t.accountTo.Credit(100)

	t.transactionDB = NewTransactionDB(db)
}

func (t *TransactionDBTestSuite) TearDownSuite() {
	defer t.db.Close()
	t.db.Exec("DROP TABLE clients")
	t.db.Exec("DROP TABLE accounts")
	t.db.Exec("DROP TABLE transactions")
}

func TestTransactionDbTestSuite(t *testing.T) {
	suite.Run(t, new(TransactionDBTestSuite))
}

func (t *TransactionDBTestSuite) TestCreateTransaction() {
	transaction, err := entity.NewTransaction(t.accountFrom, t.accountTo, 100)
	t.Nil(err)

	err = t.transactionDB.Create(transaction)
	t.Nil(err)
}
