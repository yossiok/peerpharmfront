export interface FreeBatch {
    batchNumber: string,
    orderNumber: string,
    originalQnt: number,
    updatedQnt: number,
    position: string,
    itemNumber: string,
    itemName: string,
}

export interface FreeBatches {
    batches: Array<FreeBatch>,
    date: Date,
    fileName: string,
    userName: string,
    remark: string
}