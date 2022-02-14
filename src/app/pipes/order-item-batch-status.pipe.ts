import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "orderItemBatchStatus",
})
export class OrderItemBatchStatusPipe implements PipeTransform {
  transform(value: number): string {
    let status = "";
    switch (value) {
      case 0:
        status = "New";
        break;
      case 1:
        status = "Waiting";
        break;
      case 2:
        status = "PP&C";
        break;
      case 3:
        status = "Formula";
        break;
      case 4:
        status = "Scheduled";
        break;
      case 5:
        status = "Materials";
        break;
      case 6:
        status = "Produced";
        break;
      case 7:
        status = "Done";
        break;
      case 8:
        status = "Canceled";
        break;
      case 9:
        status = "Partial Produce";
        break;
      case 10:
        status = "Filling Only";
        break;
      default:
        status = "Unknown";
    }
    return status;
  }
}
