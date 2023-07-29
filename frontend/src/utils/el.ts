export declare type Validator<V, R> = (value: V, rule?: R) => Promise<void>
export const asyncValidator =
  <V, R, E>(validator: Validator<V, R>) =>
  (rule: R, value: V, callback: (error?: E) => void) => {
    Promise.resolve(validator(value, rule))
      .then(() => callback())
      .catch((err) => callback(err))
  }
