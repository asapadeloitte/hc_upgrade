import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { CurrencyPipe, formatCurrency, getLocaleCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'FdaCurrency'
})
export class FdaCurrencyPipe implements PipeTransform {

  transform(
    value: number,
    currencyCode: string = 'USD',
    display:
      | 'code'
      | 'symbol'
      | 'symbol-narrow'
      | string
      | boolean = 'symbol',
    digitsInfo: string = '1.0-2',
    locale: string = 'en-US',
  ): string | null {
    if (value !== null) {
      // return ((new CurrencyPipe('en-US')).transform(value, currencyCode, true, digitsInfo, locale));
      return formatCurrency(
        value,
        locale,
        getLocaleCurrencySymbol(locale),
        currencyCode,
        digitsInfo,
      );
    }
  }
}
