import { ProductionOrders } from './production-orders';

export class ProductionSchedule {
  prodRequestNumber: number;
  itemNumber: string;
  makatNumber: string;
  itemBarkod: string;
  itemTotalQuantity: number;
  orders: ProductionOrders[];

  constructor() {
    this.orders = [];
  }
}
