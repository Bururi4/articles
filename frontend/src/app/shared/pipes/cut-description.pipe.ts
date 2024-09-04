import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cutDescription'
})
export class CutDescriptionPipe implements PipeTransform {

  transform(description: string, descriptionLength: number): string {
    let result: string = '';
    if (description.length <= descriptionLength) {
      result = description;
    } else if (description.length > descriptionLength) {
      result = description.slice(0, descriptionLength) + '...';
    }
    return result;
  }
}
