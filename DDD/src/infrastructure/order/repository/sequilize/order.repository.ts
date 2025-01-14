import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    for (const item of entity.items) {
      const itemExist = await OrderItemModel.findOne({ where: { id: item.id } });

      if (itemExist) {
        await OrderItemModel.update(
          {
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          },
          {
            where: {
              id: item.id,
            },
          }
        );
      }
    }

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        include: ["items"],
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const orderItems = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      );
    });
    const order = new Order(id, orderModel.customer_id, orderItems);
    return order;
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ["items"] });

    const orders = orderModels.map((orderModel) => {
      const orderItems = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        );
      });
      let order = new Order(orderModel.id, orderModel.customer_id, orderItems);
      return order;
    });

    return orders;
  }
}

