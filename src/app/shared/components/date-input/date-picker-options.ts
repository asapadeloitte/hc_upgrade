// export interface IDatePickerOptions {
//   pickerType: 'both' | 'calendar' | 'timer';
//   pickerMode: 'popup' | 'dialog';
//   startView: 'month' | 'year';
//   startAt: 'T' | null;
//   firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
//   showSecondsTimer: boolean;
//   hour12Timer: boolean;
//   stepHour: number;
//   stepMinute: number;
//   stepSecod: number;
//   disabled: boolean;
// }

export class DatePickerOptions {
  pickerType: 'both' | 'calendar' | 'timer' = 'calendar';
  pickerMode: 'popup' | 'dialog' = 'popup';
  startView: 'month' | 'year' = 'month';
  startAt: 'T' = null;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;
  showSecondsTimer = false;
  hour12Timer = false;
  stepHour = 1;
  stepMinute = 1;
  stepSecod = 1;
  disabled = false;
}

export const DATEPICKER_FORMATS = {
  fullPickerInput: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  },
  datePickerInput: { year: 'numeric', month: '2-digit', day: '2-digit' },
  timePickerInput: { hour: '2-digit', minute: '2-digit' },
  monthYearLabel: { year: '2-digit', month: 'short' },
  dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
  monthYearA11yLabel: { year: 'numeric', month: 'long' }
};
