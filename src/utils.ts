export function toTitleCase(value: string) {
  const words = value.split(' ');
  const titledWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase(),
  );
  return titledWords.join(' ');
}
