import { DeliveryCertificate } from "./DeliveryCert";

export interface PurchaseData {
    _id: string;
    supplierName: string;
    supplierNumber: string;
    supplierEmail: string;
    creationDate: Date;
    arrivalDate: Date;
    color: string;
    stockitems: any[];
    orderNumber: string;
    userEmail: string;
    user: string;
    billNumber: any[];
    closeReason: string;
    orderType: string;
    remarks: string;
    status: string;
    deliveryCerts: DeliveryCertificate[];
    outOfCountry: boolean;
}