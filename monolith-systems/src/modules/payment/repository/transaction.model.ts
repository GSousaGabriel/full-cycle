import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "transactions",
    timestamps: false
})
export default class TransactionModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    orderId: string;

    @Column({ type: DataType.NUMBER, allowNull: false })
    amount: number;

    @Column({ type: DataType.STRING, allowNull: false })
    status: string;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;
}