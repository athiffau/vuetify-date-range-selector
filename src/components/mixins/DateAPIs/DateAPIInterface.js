/*
??? how do I define a type for a string with a specific format... like ISO date ???
// ??? how do I define a type for a javascript date object rather than any object ???
export type TAnyDate = number | object | string | null
// ??? how do I define that JSDate must be a javascript date object ???
export type TJSDate = object
// ??? how do I define an objec type that must have this format {start: string, end: string}
export type TRangeDates = object
// ??? how do I define a type that accepts a number between 0 and 52 or an array of numbers each having the same constraints
export type TWeekNumber = number | Array<number>
// ??? how do I define a type that accepts a number between 0 and 11 or an array of numbers each having the same constraints
export type TMonthNumber = number | Array<number>

export interface IDateAPI {
   dateStartPrevWeek(date: TAnyDate): TJSDate;
   dateEndPrevWeek(date: TAnyDate): TJSDate;
   dateStartOfWeek(date: TAnyDate): TJSDate;
   dateEndOfWeek(date: TAnyDate): TJSDate;
   dateStartOfMonth(date: TAnyDate): TJSDate;
   dateEndOfMonth(date: TAnyDate): TJSDate;

   getWeekNumbers(date: TAnyDate, format: String): Array<TRangeDates>;
   getMonthShortNames(): Array<String>;
   getMonthLongNames(): Array<String>;
   getWeekDates(date: TAnyDate, weekNumber: TWeekNumber): TRangeDates | Array<TRangeDates>;
   getMonthDates(date: TAnyDate, monthNumber: TMonthNumber): TRangeDates | Array<TRangeDates>;
   getCurrentDate(date: TAnyDate): number;
   getCurrentWeek(date: TAnyDate): TWeekNumber;
   getCurrentPeriod(date: TAnyDate): number;
   getCurrentMonth(date: TAnyDate): number;
   getCurrentQuarter(date: TAnyDate): number;
   getCurrentYear(date: TAnyDate): number;
   getDayOfWeek(date: TAnyDate): number;
}
*/