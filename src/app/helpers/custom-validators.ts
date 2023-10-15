import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from "moment"

export class CustomValidators {
  static dateMinimum(date: moment.Moment): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return null;
      }
      const controlDate = moment(control.value).subtract(1, 'month');

      return controlDate.diff(date, 'days') < 0 ? {'date-minimum': true} : null;
    };
  }
}
