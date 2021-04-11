export interface MaterialArrivalCertif {
    certifNumber: number;
    userName: string,
    date: Date;
    supplierCertifNumber: string;
    supplierName: string;
    supplierNumber: string;
    supplierOrderNumber: string;
    purchaseOrderNumber: number;
    materialArrivalLines: MaterialArrivalLine [];
    sumAmount: number;
}

export interface MaterialArrivalLine {
    itemInternalNumber: string;
    itemName: string;
    itemSupplierNumber: string;
    wareHouse: string;
    position: string;
    amount: number;
}