import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "workPlanStatus",
})
export class WorkPlanStatusPipe implements PipeTransform {
  transform(value: number): string {
    let status = "";
    switch (value) {
      case 1:
        status = "Draft";
        break;
      case 2:
        status = "Moved to Production";
        break;
      case 3:
        status = "in Production";
        break;
      case 4:
        status = "Manufactured";
        break;
      case 5:
        status = "Closed";
        break;
      case 6:
        status = "On Hold";
        break;
      case 7:
        status = "Cancelled";
        break;
      default:
        status = "Unknown";
    }
    return status;
  }
}
