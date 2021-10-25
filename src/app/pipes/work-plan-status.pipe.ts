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
      case 2: status = 'Approved by Manager'
      break
      case 3: status = 'Approved for Production'
      break
    }
    return status
  }

}
