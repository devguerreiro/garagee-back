import dayjs from 'src/lib/dayjs';

export function toTitleCase(value: string) {
  const words = value.split(' ');
  const titledWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase(),
  );
  return titledWords.join(' ');
}

export function brazilianDate(date: Date): string {
  return dayjs(date).format('L');
}

export function brazilianDateTime(date: Date): string {
  return dayjs(date).format('L LT');
}
