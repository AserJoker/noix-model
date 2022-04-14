import { IModel } from "./types";

const defineModel = <S extends Record<string, unknown>>(model: IModel<S>) => {
  return model as IModel<Record<string, unknown>>;
};
export { defineModel };
