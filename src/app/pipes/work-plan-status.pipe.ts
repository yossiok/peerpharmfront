import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "workPlanStatus",
})
export class WorkPlanStatusPipe implements PipeTransform {
  transform(value: number): string {
    let status = "";
    switch (value) {
      case 0:
        status = "New";
        break;
      case 1:
        status = "New";
        break;
      case 2:
        status = "Draft";
        break;
      case 3:
        status = "Approved";
        break;
      case 4:
        status = "Scheduled";
        break;
      case 5:
        status = "Done";
        break;
      case 6:
        status = "On Hold";
        break;
      case 7:
        status = "Cancelled";
        break;
      case 8:
        status = "All";
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
