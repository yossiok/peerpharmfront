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
      case 2: status = 'Moved to Production'
      break
      case 3: status = 'in Production'
      break
    }
    return status
  }

}
