import { Pipe, PipeTransform } from '@angular/core';
import { VIDEO_FILETYPE } from '../models/filetype';

@Pipe({
  	name: 'isVideo'
})

export class IsVideoPipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		if (value in VIDEO_FILETYPE) {
			return true;
		}
	}

}
