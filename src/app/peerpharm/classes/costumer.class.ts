export class Costumer {
    constructor(public _id: string, public costumerName: string) {}
  }
  
  export interface ICostumerResponse {
    total: number;
    results: Costumer[];
  }