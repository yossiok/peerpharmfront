import { InvoiceStockItem } from "./InvoiceStockItem";

export interface InvoiceData {
    purchaseInvoiceNumber: number,
    invoiceRemarks: string,
    coinRate: number,
    stockitems: InvoiceStockItem[],
    invoiceCoin: string,
    invoicePrice: number,
    taxes: number ,
    taxesTwo: number,
    fixedPrice: number;
    itemShipping: number;
}