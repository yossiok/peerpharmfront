export interface DeliveryCertificate {
    certificateNumber: string;
    deliveryArrivalDate: Date;
    itemNumber: string;
    amount: number;
    remarks: string[];
    userName: string;
}