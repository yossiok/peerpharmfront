export interface FreeBatch {
    batchNumber: string,
    orderNumber: string,
    originalQnt: number,
    updatedQnt: number,
    position: string,
    itemNumber: string,
    itemName: string,
    color?: string
}

export interface FreeBatchesFile {
    batches: Array<FreeBatch>,
    date: Date,
    fileName: string,
    userName: string,
    remark: string
}