import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "orderItemBatchStatusColor",
})
export class OrderItemBatchStatusColorPipe implements PipeTransform {
  transform(value: number): string {
    let color = "";
    switch (value) {
      case 0:
        color = "#FFF";
        break;
      case 1:
        color = "#FFC000";
        break;
      case 2:
        color = "#68e37d";
        break;
      case 3:
        color = "#5B9BD5";
        break;
      case 4:
        color = "#ED7D31";
        break;
      case 5:
        color = "#C48170";
        break;
      case 6:
        color = "#A5A5A5";
        break;
      case 7:
        color = "#1a8a22";
        break;
      case 8:
        color = "#c93682";
        break;
      default:
        color = "";
    }
    return color;
  }
}
