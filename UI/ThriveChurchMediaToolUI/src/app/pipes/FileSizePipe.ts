import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filesize' })
export class FileSizePipe implements PipeTransform {
	
	transform(size: number, format: string = 'MB'): string {

		// comes in as MB
		var value: number = size;

		if (format === 'GB') {
			value = size / 1024;
		}
		if (format === 'TB') {
			value = size / Math.pow(1024, 2);
		}
		else if (format === 'MB') {
			value = size;
		}

		/*
			Mini Rant to explain this code here....

			Turns out that rounding in JS is annoying and there's no sense to the madness
			as a result, we have to do something nonsensical here because browers do 
			different things and MDN itself doesn't seem to know what it's doing.

			See more: https://stackoverflow.com/questions/11832914/

			So, I've decided that rounding isn't really that important at all in the end.
			We're just going to trim the string 2 characters after the '.' and that way this example
			will ACTUALLY WORK.

			I expect that 1.498 to equal 1.49 when rounding occurs. HOWEVER...
			what actually happens, no matter if you use Math.round() or toFixed() they're both wrong.
			Maybe my expecation is wrong, but this feels wrong to me.

			They spit out 1.5. Which technically IS the correct rounded value, but even when 
			writing them to get 2 decimals they ALWAYS go for 1.5. It seems like it might be something
			to do with floating point percision and how JS handles that.

			Anyways........
			That's where we're at. 

			😊
		*/

		var answer = `${value}`;
		answer = `${answer.substring(0, answer.indexOf('.') + 3)}`;

		return answer.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}
}