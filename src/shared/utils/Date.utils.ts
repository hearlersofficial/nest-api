import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export function getNowDayjs(): Dayjs {
  return dayjs();
}

export function convertDayjs(dateString: string): Dayjs {
  return dayjs(dateString);
}

export function formatDayjs(date: Dayjs): string | null {
  if (!date) return null;
  return date.format("YYYY-MM-DD HH:mm:ss");
}

export function isBetweenDayjs(target: Dayjs, from: Dayjs, to: Dayjs): boolean {
  return target.isBetween(from, to);
}
