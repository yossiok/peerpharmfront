import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formulesTypes",
})
export class FormulesTypesPipe implements PipeTransform {
  transform(value: string): any {
    let formuleType;
    switch (value) {
      case "":
        formuleType = "Regular Formule";
        break;
      case "regular":
        formuleType = "Regular Formule";
        break;
      case "father":
        formuleType = "Parent Forumule";
        break;
      case "base":
        formuleType = "Base Formule";
        break;
      case "child":
        formuleType = "Child Formule";
        break;
      case "brother":
        formuleType = "Sibling Formule";
        break;
    }
    return formuleType;
  }
}
