import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isImage'
})
export class IsImagePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
