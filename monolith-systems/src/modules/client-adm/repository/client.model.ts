import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: 'client',
  timestamps: false
})
export class ClientModel extends Model {
  @PrimaryKey
  @Column({type: DataType.STRING, allowNull: false })
  id: string

  @Column({type: DataType.STRING, allowNull: false })
  name: string

  @Column({type: DataType.STRING, allowNull: false })
  email: string

  @Column({type: DataType.STRING, allowNull: false })
  document: string

  @Column({type: DataType.STRING, allowNull: false })
  street: string

  @Column({type: DataType.STRING, allowNull: false })
  number: string

  @Column({type: DataType.STRING, allowNull: true })
  complement: string

  @Column({type: DataType.STRING, allowNull: false })
  city: string

  @Column({type: DataType.STRING, allowNull: false })
  state: string

  @Column({type: DataType.STRING, allowNull: false })
  zipcode: string

  @Column({type: DataType.DATE, allowNull: false })
  createdAt: Date

  @Column({type: DataType.DATE, allowNull: false })
  updatedAt: Date
}