const elapsedTimeInSeconds = (start: number, end: number): number =>
  Math.round((end - start) / 10) / 100;

export { elapsedTimeInSeconds };
