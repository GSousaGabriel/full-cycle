package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateNewClient(t *testing.T) {
	client, err := NewClient("John Doe", "email@email.com")

	assert.Nil(t, err)
	assert.NotNil(t, client)
	assert.Equal(t, "John Doe", client.Name)
	assert.Equal(t, "email@email.com", client.Email)
}

func TestCreateNewClientWhenArgsAreInvalid(t *testing.T) {
	client, err := NewClient("", "")

	assert.NotNil(t, err)
	assert.Nil(t, client)
}

func TestUpdateClient(t *testing.T) {
	client, _ := NewClient("John Doe", "email@email.com")
	err := client.Update("John Doe updated", "j@j.com")

	assert.Nil(t, err)
	assert.Equal(t, "John Doe updated", client.Name)
	assert.Equal(t, "j@j.com", client.Email)
}

func TestUpdateClientWhenArgsAreInvalid(t *testing.T) {
	client, _ := NewClient("John Doe", "email@email.com")
	err := client.Update("", "j@j.com")

	assert.NotNil(t, err)
	assert.Error(t, err, "name is  required")
}

func TestAddAccountToClient(t *testing.T) {
	client, _ := NewClient("John Doe", "email@email.com")
	account := NewAccount(client)
	err := client.AddAccount(account)

	assert.Nil(t, err)
	assert.Len(t, client.Accounts, 1)
}
