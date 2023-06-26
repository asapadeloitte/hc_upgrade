import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterlist'
})
export class FilterlistPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (args.length < 0 || args.length === 0) {
            return value;
        } else if (args.length > 0) {
            return value.filter(
                item => item.smartListValue.toLowerCase().indexOf(args.toLowerCase()) > -1
            );
        }
    }
}
