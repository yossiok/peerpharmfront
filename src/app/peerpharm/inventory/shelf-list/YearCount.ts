export interface ShelfStocktake{
    _id: Object,
    arrivalDate: Date,
    countedAmount: number,
    difference: number,
    shell_id_in_whareHouse: string,
    total: number,
    whareHouse: string,
    whareHouseID: string
}


export interface YearCount {
    date: Date,
    userName: string,
    whareHouse: string,
    updates: ShelfStocktake[],
    serialNumber: number
}

  