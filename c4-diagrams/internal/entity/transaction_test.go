package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateTransaction(t *testing.T) {
	client, _ := NewClient("John Doe", "email@email.com")
	client2, _ := NewClient("John Doe2", "email2@email.com")
	account := NewAccount(client)
	account2 := NewAccount(client2)

	account.Credit(100)
	account2.Credit(100)

	transaction, err := NewTransaction(account, account2, 100)

	assert.Nil(t, err)
	assert.NotNil(t, transaction)
	assert.Equal(t, 100.0, transaction.Amount)
	assert.Equal(t, 0.0, account.Balance)
	assert.Equal(t, 200.0, account2.Balance)
}

func TestCreateTransactionWithInsufficientBalance(t *testing.T) {
	client, _ := NewClient("John Doe", "email@email.com")
	client2, _ := NewClient("John Doe2", "email2@email.com")
	account := NewAccount(client)
	account2 := NewAccount(client2)

	account.Credit(100)
	account2.Credit(100)

	transaction, err := NewTransaction(account, account2, 200)

	assert.NotNil(t, err)
	assert.Nil(t, transaction)
	assert.Error(t, err, "insufficient funds")
	assert.Equal(t, 100.0, account.Balance)
	assert.Equal(t, 100.0, account2.Balance)
}
