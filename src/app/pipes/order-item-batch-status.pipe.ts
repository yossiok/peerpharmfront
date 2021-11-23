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
        status = "PP&C Draft";
        break;
      case 3:
        status = "Formula Approved";
        break;
      case 4:
        status = "Scheduled";
        break;
      case 5:
        status = "Materials Allocated";
        break;
      case 6:
        status = "Produced";
        break;
      case 7:
        status = "Done";
        break;
      default:
        status = "Unknown";
    }
    return status;
  }
}
