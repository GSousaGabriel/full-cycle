package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateAccount(t *testing.T) {
	client, _ := NewClient("John Doe", "s@eemail.com")
	account := NewAccount(client)

	assert.NotNil(t, account)
	assert.Equal(t, client.ID, account.Client.ID)
}

func TestCreateAccountWithoutClient(t *testing.T) {
	account := NewAccount(nil)

	assert.Nil(t, account)
}

func TestCreditAcount(t *testing.T) {
	client, _ := NewClient("John Doe", "s@eemail.com")
	account := NewAccount(client)
	account.Credit(50)

	assert.NotNil(t, account)
	assert.Equal(t, 50.0, account.Balance)
}

func TestDebitAcount(t *testing.T) {
	client, _ := NewClient("John Doe", "s@eemail.com")
	account := NewAccount(client)
	account.Debit(50)

	assert.NotNil(t, account)
	assert.Equal(t, -50.0, account.Balance)
}
