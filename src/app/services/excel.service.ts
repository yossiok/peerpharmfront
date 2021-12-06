import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";
@Injectable()
export class ExcelService {
  constructor() {}
  public exportAsExcelFile(
    json: any[],
    excelFileName: string,
    order?: any[],
    sheetName?: string
  ): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {
      header: order,
    });
    let sName = sheetName ? sheetName : "data";
    const workbook: XLSX.WorkBook = {
      Sheets: { [sName]: worksheet },
      SheetNames: [sName],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    if (order) {
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      range.e["c"] = order.length - 1;
      worksheet["!ref"] = XLSX.utils.encode_range(range);
    }
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
