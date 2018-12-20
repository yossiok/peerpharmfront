import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'headingsWH'
})
export class HeadingsWHPipe implements PipeTransform {
  transform(value: string ): any {
    var heading;
    switch (value) {
      case "in":
        heading = "קבלת סחורה למחסן";
        break;
      case "out":
        heading = "הוצאת סחורה מהמחסן";
        break;
      case "production":
         heading = "העברת סחורה לייצור";
        break;
      case "shellChange":
        heading = "העברת סחורה למדף אחר";
        break;
      case "managment":
        heading = "ניהול מחסנים - מורשים בלבד";
        break;
    }
    return heading;
  }

}
