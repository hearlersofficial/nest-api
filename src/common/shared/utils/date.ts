import dayjs, { Dayjs } from "dayjs";

export function getNowDayjs(): Dayjs {
  return dayjs.utc();
}

export function isBetweenDayjs(target: Dayjs, from: Dayjs, to: Dayjs): boolean {
  return target.isBetween(from, to);
}
