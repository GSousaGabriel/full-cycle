import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "products",
    timestamps: false
})
export default class ProductModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ type: DataType.NUMBER, allowNull: false })
    purchasePrice: number;

    @Column({ type: DataType.NUMBER, allowNull: false })
    stock: number;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;
}