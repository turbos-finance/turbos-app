import Bignumber from 'bignumber.js';
import { numberWithCommas } from '.';

export const decimal = 9;

export const bignumberDivDecimalFixed = (value: Bignumber | string | number, fixed: number = 2) => {
  return Bignumber(value).div(10 ** decimal).toFixed(fixed);
}

export const bignumberDivDecimalString = (value: Bignumber | string | number) => {
  return Bignumber(value).div(10 ** decimal).toString();
}

export const bignumberMulDecimalString = (value: Bignumber | string | number) => {
  return Bignumber(value).multipliedBy(10 ** decimal).toString();
}

export const bignumberWithCommas = (x: string | undefined | number | Bignumber, fixed: number = 2, unit = '$') => {
  if (!x) {
    return '-';
  }
  const value = Bignumber(x).div(10 ** decimal);
  if (!value.toNumber()) {
    return '-';
  }
  return `${unit}${numberWithCommas(value.toFixed(fixed))}`;
}

export const bignumberWithPercent = (x: string | undefined | number | Bignumber, fixed: number = 2, unit = '%', isPlus: boolean = false) => {
  if (!x) {
    return '-';
  }
  const value = Bignumber(x).multipliedBy(100);
  const isLessZore = value.isGreaterThan(0);
  return `${isPlus && isLessZore ? '+' : ''}${value.toFixed(fixed)}${unit}`;
}

export const bignumberRemoveDecimal = (value: Bignumber | string | number) => {
  const val = Bignumber(value).toFixed(0);
  return Bignumber(val).toNumber()
}