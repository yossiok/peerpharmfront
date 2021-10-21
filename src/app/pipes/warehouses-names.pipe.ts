import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "warehousesNames",
})
export class WarehousesNamesPipe implements PipeTransform {
  transform(value: string): any {
    let warehouseName;
    switch (value) {
      case "Kasem":
        warehouseName = "מחסן קאסם";
        break;
      case "Rosh HaAyin":
        warehouseName = "מחסן ראש העין";
        break;
      case "Rosh HaAyin products":
        warehouseName = "מחסן ראש העין - מוצרים";
        break;
      case "Karantine":
        warehouseName = 'מחסן חו"ג - הסגר';
        break;
      case "makeup":
        warehouseName = "מחסן מייקאפ";
        break;
      case "Packaging":
        warehouseName = "אריזות";
        break;
      case "Filling":
        warehouseName = "מילוי";
        break;
      case "Labels":
        warehouseName = "מדבקות";
        break;
      case "NEW KASEM":
        warehouseName = "מחסן קאסם החדש";
        break;
      case "ARIEL 1":
        warehouseName = "מחסן אריאל - 1";
        break;
      case "ARIEL 2":
        warehouseName = "מחסן אריאל - 2";
        break;
      case "ARIEL 3":
        warehouseName = "מחסן אריאל - 3";
        break;
      case "ARIEL 4":
        warehouseName = "מחסן אריאל - 4";
        break;
    }
    return warehouseName;
  }
}
