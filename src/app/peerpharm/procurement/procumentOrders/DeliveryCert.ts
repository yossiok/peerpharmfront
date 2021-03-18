import { StockItem } from "../new-procurement/StockItem";

export interface DeliveryCertificate {
    certificateNumber: string;
    deliveryArrivalDate: Date;
    stockitems: StockItem[];
    remarks: string;
    userName: string;
}