import { Pipe, PipeTransform } from '@angular/core';
import { IMAGE_FILETYPE } from '../models/filetype';

@Pipe({
	name: 'isImage'
})

export class IsImagePipe implements PipeTransform {

	transform(value: any, ...args: any[]): any {
		if (value in IMAGE_FILETYPE) {
			return true;
		}
	}

}
