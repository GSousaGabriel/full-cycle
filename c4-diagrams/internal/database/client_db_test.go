package database

import (
	"database/sql"
	"testing"

	"github.com.br/devfullcycle/fc-ms-wallet/internal/entity"
	_ "github.com/mattn/go-sqlite3"
	"github.com/stretchr/testify/suite"
)

type ClientDBTestSuite struct {
	suite.Suite
	db       *sql.DB
	ClientDB *ClientDB
}

func (s *ClientDBTestSuite) SetupSuite() {
	db, err := sql.Open("sqlite3", ":memory:")
	s.Nil(err)
	s.db = db
	db.Exec("CREATE TABLE clients (id TEXT, name TEXT, email TEXT, created_at DATETIME)")
	s.ClientDB = NewClientDB(db)
}

func (s *ClientDBTestSuite) TearDownSuite() {
	defer s.db.Close()
	s.db.Exec("DROP TABLE clients")
}

func TestClientDbTestSuite(t *testing.T) {
	suite.Run(t, new(ClientDBTestSuite))
}

func (s *ClientDBTestSuite) TestSaveClient() {
	client := &entity.Client{
		ID:    "1",
		Name:  "John Doe",
		Email: "email@email.com",
	}

	err := s.ClientDB.Save(client)

	s.Nil(err)
}

func (s *ClientDBTestSuite) TestGetClient() {
	client, _ := entity.NewClient("John Doe", "email@email.com")
	s.ClientDB.Save(client)

	clientDB, err := s.ClientDB.Get(client.ID)

	s.Nil(err)
	s.Equal(client.ID, clientDB.ID)
	s.Equal(client.Name, clientDB.Name)
	s.Equal(client.Email, clientDB.Email)
}
