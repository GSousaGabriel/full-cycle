package createtransaction

import (
	"testing"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type TransactionGateawayMock struct {
	mock.Mock
}

type AccountGateawayMock struct {
	mock.Mock
}

func (m *TransactionGateawayMock) Create(transaction *entity.Transaction) error {
	args := m.Called(transaction)
	return args.Error(0)
}

func (m *AccountGateawayMock) Save(account *entity.Account) error {
	args := m.Called(account)
	return args.Error(0)
}

func (m *AccountGateawayMock) GetByID(id string) (*entity.Account, error) {
	args := m.Called(id)
	return args.Get(0).(*entity.Account), args.Error(1)
}

func TestCreateTransactionUseCase_Execute(t *testing.T) {
	client, _ := entity.NewClient("John Doe", "email@email.cm")
	account := entity.NewAccount(client)
	account.Credit(100)

	client2, _ := entity.NewClient("John Doe 2", "email2@email.cm")
	account2 := entity.NewAccount(client2)
	account2.Credit(100)

	mockAccount := &AccountGateawayMock{}
	mockAccount.On("GetByID", account.ID).Return(account, nil)
	mockAccount.On("GetByID", account2.ID).Return(account2, nil)

	mockTransaction := &TransactionGateawayMock{}
	mockTransaction.On("Create", mock.Anything).Return(nil)

	uc := NewCreateTransactionUseCase(mockTransaction, mockAccount)

	output, err := uc.Execute(CreateTransactionInputDto{
		AccountIDFrom: account.ID,
		AccountIDTo:   account2.ID,
		Amount:        100,
	})

	assert.Nil(t, err)
	assert.NotNil(t, output)
	mockAccount.AssertExpectations(t)
	mockAccount.AssertNumberOfCalls(t, "GetByID", 2)
	mockTransaction.AssertExpectations(t)
	mockTransaction.AssertNumberOfCalls(t, "Create", 1)
}
