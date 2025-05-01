export type Result<T, E> = Success<T> | Failure<E>;

export interface Success<T> {
  isSuccess: true;
  value: T;
}

export interface Failure<E> {
  isSuccess: false;
  error: E;
}

export function success<T>(value: T): Success<T> {
  return { isSuccess: true, value };
}

export function failure<E>(error: E): Failure<E> {
  return { isSuccess: false, error };
}
