interface OrderItem{
    customerID: string,
    customerName: string,
    description: string,
    enoughMaterials: boolean,
    formule: any,
    itemNumber: string,
    netWeightGr: number,
    orderNumber: string,
    parentFormule: string,
    quantity: string,
    totalKG: number,
    remarks: string,
    enoughComponents: boolean,
    status: number,
    checked?: boolean
}

export interface ProductionFormule {
    enoughMaterials: boolean,
    formule: string,
    totalKG: number,
    batchNumber: string,
    ordersAndItems: orderAndItem[],
    formuleData: Object,
    status: number,
    checked?: boolean,
    dueDate?: Date
    // numOfItems: number  
}

export interface WorkPlan {
  orderItems: OrderItem[],
  productionFormules: ProductionFormule[],
  status: number,
  serialNumber: number,
  date: Date,
  remark: string
}

export interface orderAndItem {
  order: string,
  item: string,
  itemName: string,
  weightKg: number
}