import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "oiStatusColor",
})
export class OiStatusColorPipe implements PipeTransform {
  transform(value: string): string {
    let color = "";
    switch (value) {
      case "open":
        color = "#FFF";
        break;
      case "partFilled":
        color = "#FFC000";
        break;
      case "filled":
        color = "#68e37d";
        break;
      case "partPacked":
        color = "#5B9BD5";
        break;
      case "packed":
        color = "#ED7D31";
        break;
      case "partShipped":
        color = "#C48170";
        break;
      case "shipped":
        color = "#A5A5A5";
        break;
      case "closed":
        color = "#1A8A22";
        break;
      case "cancelled":
        color = "#c93682";
        break;
      default:
        color = "";
    }
    return color;
  }
}
