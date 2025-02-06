import { Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: "items",
    timestamps: false
})
export default class ItemModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    id: string;

    @ForeignKey(() => InvoiceModel)
    @Column({ type: DataType.STRING, allowNull: false })
    invoice_id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.NUMBER, allowNull: false })
    price: number;
}