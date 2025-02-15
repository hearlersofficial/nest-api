import dayjs, { Dayjs } from "dayjs";

export function getNowDayjs(): Dayjs {
  return dayjs.utc();
}

export function convertUtcStringToDayjs(utcDateString: string): Dayjs {
  return dayjs.utc(utcDateString);
}

export function formatDayjsToUtcString(date: Dayjs): string | null {
  if (!date) return null;
  return date.utc().format("YYYY-MM-DD HH:mm:ss");
}

export function isBetweenDayjs(target: Dayjs, from: Dayjs, to: Dayjs): boolean {
  return target.isBetween(from, to);
}
