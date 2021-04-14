export interface MaterialArrivalCertif {
    certifNumber: number;
    userName: string,
    date: Date;
    supplierCertifNumber: string;
    supplierName: string;
    supplierNumber: string;
    supplierOrderNumber: string;
    materialArrivalLines: MaterialArrivalLine [];
    sumAmount: number;
    sumUnits: number;
}

export interface MaterialArrivalLine {
    itemInternalNumber: string;
    itemName: string;
    purchaseOrderNumber: number;
    itemSupplierNumber: string;
    wareHouse: string;
    position: string;
    amount: number;
    unitsAmount: number;
    remarks: string
}