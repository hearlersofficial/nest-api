import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function getNowDayjs(): Dayjs {
  return dayjs().utc();
}

export function isBetweenDayjs(target: Dayjs, from: Dayjs, to: Dayjs): boolean {
  return target.isBetween(from, to);
}

export function convertDayjs(date: string | Date): Dayjs {
  return dayjs(date).utc();
}
