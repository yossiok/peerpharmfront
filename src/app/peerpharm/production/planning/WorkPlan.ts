interface OrderItem{
    customerID: string,
    customerName: string,
    description: string,
    enoughMaterials: boolean,
    formule: Object,
    itemNumber: string,
    netWeightGr: number,
    orderNumber: string,
    parentFormule: string,
    quantity: string,
    totalKG: number,
    remarks: string,
    enoughComponents: boolean,
    batchNumber: string
}

export interface ProductionFormule {
    enoughMaterials: boolean,
    formule: string,
    totalKG: number
}

export interface WorkPlan {
  orderItems: OrderItem[],
  productionFormules: ProductionFormule[],
  status: number,
  serialNumber: number
}