package createaccount

import (
	"testing"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type AccountGateawayMock struct {
	mock.Mock
}

type ClientGateawayMock struct {
	mock.Mock
}

func (m *ClientGateawayMock) Save(client *entity.Client) error {
	args := m.Called(client)
	return args.Error(0)
}

func (m *ClientGateawayMock) Get(id string) (*entity.Client, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Client), args.Error(1)
}

func (m *AccountGateawayMock) Save(account *entity.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *AccountGateawayMock) GetByID(id string) (*entity.Account, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Account), args.Error(1)
}

func TestCreateAccountUseCase_Execute(t *testing.T) {
	client, _ := entity.NewClient("John Doe", "email@email.com")

	clientMock := &ClientGateawayMock{}
	accountMock := &AccountGateawayMock{}

	clientMock.On("Get", client.ID).Return(client, nil)
	accountMock.On("Save", mock.Anything).Return(nil)

	uc := NewCreateAccountUseCase(accountMock, clientMock)

	output, err := uc.Execute(CreateAccountInputDto{
		ClientID: client.ID,
	})

	assert.Nil(t, err)
	assert.NotNil(t, output)
	accountMock.AssertExpectations(t)
	clientMock.AssertExpectations(t)
	clientMock.AssertNumberOfCalls(t, "Get", 1)
	accountMock.AssertNumberOfCalls(t, "Save", 1)
}
