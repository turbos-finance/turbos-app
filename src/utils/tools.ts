import Bignumber from 'bignumber.js';

const decimal = 9;

export const bignumberDivDecimalFixed = (value: Bignumber, fixed: number = 2) => {
  return value.div(10 ** decimal).toFixed(fixed);
}

export const bignumberDivDecimalString = (value: Bignumber) => {
  return value.div(10 ** decimal).toString();
}

export const bignumberMulDecimalString = (value: Bignumber) => {
  return value.multipliedBy(10 ** decimal).toString();
}