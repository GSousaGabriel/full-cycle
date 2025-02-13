package gateway

import "github.com.br/devfullcycle/fc-ms-wallet/internal/entity"

type AccountGateway interface {
	Save(client *entity.Account) error
	GetByID(id string) (*entity.Account, error)
}
