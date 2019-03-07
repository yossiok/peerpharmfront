
export class FormuleItem {
  number: number;//מספר פריט חו"ג במלאי -פנימי שלנו 
  name: string;
  quantity: number;
  percentage: number;
  itemPH: number;
  instructions: string;
  suplierNumber: string; //מספר מזהה של הספק -ממערכת קומקס
  suplierName: string;// שם הספק של החו"ג-ממערכת קומקס
  suplierItemNumber: string; // מק"ט של הפריט אצל הספק -ממערכת קומקס 
  procurementItemNumber: string;// מספר פריט רכש - מערכת קומקס
}
