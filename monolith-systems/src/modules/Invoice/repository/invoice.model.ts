import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ItemModel from "./item.model";

@Table({
    tableName: "invoices",
    timestamps: false
})
export default class InvoiceModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    document: string;

    @Column({ type: DataType.STRING, allowNull: false })
    street: string;

    @Column({ type: DataType.STRING, allowNull: false })
    number: string;

    @Column({ type: DataType.STRING, allowNull: false })
    complement: string;

    @Column({ type: DataType.STRING, allowNull: false })
    city: string;

    @Column({ type: DataType.STRING, allowNull: false })
    state: string;

    @Column({ type: DataType.STRING, allowNull: false })
    zipCode: string;

    @HasMany(() => ItemModel)
    items: ItemModel[];
  
    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;
}