import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type TransactionProps = {
    id?: Id;
    orderId: string;
    status?: string;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export default class Transaction extends BaseEntity implements AggregateRoot {
    private _orderId: string;
    private _status: string;
    private _amount: number;

    constructor(props: TransactionProps) {
        super(props.id);
        this._orderId = props.orderId
        this._status = props.status || "pending";
        this._amount = props.amount

        this.validate()
    }

    get orderId(): string {
        return this._orderId;
    }

    get status(): string {
        return this._status;
    }

    get amount(): number {
        return this._amount;
    }

    validate(): void {
        if (this._amount <= 0) {
            throw new Error("Amount must be greater than 0")
        }
    }

    approve(): void {
        this._status = "approved"
    }

    decline(): void {
        this._status = "declined"
    }

    process(): void {
        if (this._amount >= 0) {
            this.approve()
        } else {
            this.decline()
        }
    }
}