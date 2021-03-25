import { StockItem } from "./StockItem";

export interface InvoiceData {
    purchaseInvoiceNumber: number,
    invoiceRemarks: string,
    coinRate: number,
    stockitems: StockItem[],
    invoiceCoin: string,
    invoicePrice: number,
    taxes: number ,
    taxesTwo: number,
    fixedPrice: number;
    shippingPrice: number;
}