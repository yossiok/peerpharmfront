import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStage'
})
export class OrderStagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    
    var currStage;
    switch (value) {
      case "new":
        currStage = "חדש";
        break;
      case "partialCmpt":
        currStage = "רכיבים קיימים- חלקית";
        break;
      case "allCmpt":
         currStage = "כל הרכיבים קיימים";
        break;
      case "production":
        currStage = "נשלח לייצור";
        break;
      case "prodFinish":
        currStage = "הכל עבר ייצור";
      case "done":
        currStage = "הזמנה סגורה";
        break;
    }
    return currStage;
  }

}
