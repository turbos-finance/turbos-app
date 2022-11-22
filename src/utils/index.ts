
export function debounce(func: Function, delay: number = 300, thisArg?: any) {
  let timer: number;
  return function (...args: any[]) {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(function () {
      func.apply(thisArg, args);
    }, delay);
  };
}

export function withThrottle(
  func: Function,
  delay: number = 200,
  thisArg?: any,
) {
  let timeStamp: number;
  return function (...args: any[]) {
    const nowTimeStamp = Date.now();
    if (!timeStamp || nowTimeStamp - timeStamp >= delay) {
      func.apply(thisArg, args);
      timeStamp = nowTimeStamp;
    }
  };
}