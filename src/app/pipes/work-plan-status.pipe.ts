import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workPlanStatus'
})
export class WorkPlanStatusPipe implements PipeTransform {

  transform(value: number): string {
    let status = ''
    switch(value) {
      case 1: status = 'Draft'
      break
      case 2: status = 'Manager Approval'
      break
      case 3: status = 'Production Approval'
      break
    }
    return status
  }

}
