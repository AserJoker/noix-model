import { IEffect, IModel } from "./types";
import { get, set, mixed, merge, exist } from "./utils";

export const useContainer = (models: IModel<any>[]) => {
  const modelStatus: Record<string | symbol, Record<string, unknown>> = {};
  models.forEach((model) => {
    modelStatus[model.name] = model.state;
  });
  const effects: IEffect[] = [];
  const effect = (eff: IEffect) => {
    effects.push(eff);
    eff.handle(get(modelStatus[eff.model], eff.token));
    return () => {
      const index = effects.findIndex(
        (e) => e.token === eff.token && e.handle === e.handle
      );
      if (index !== -1) {
        effects.splice(index, 1);
      }
    };
  };
  const dispatch = (
    modelName: string,
    name: string,
    payload: Record<string, unknown>
  ) => {
    const model = models.find((m) => m.name === modelName);
    if (!model) {
      throw new Error(`unkown model:${modelName.toString()}`);
    }
    const effect = model.effect[name];
    if (!effect) {
      throw new Error(`unknown effect:${name} at ${modelName.toString()}`);
    }
    const raw = modelStatus[modelName];
    let newState: typeof raw = {};
    const state = mixed(raw, newState) as Record<string, unknown>;
    let isInDispatch = true;
    const self = {
      state,
      setState: <K extends string | number | symbol>(
        name: K,
        value: unknown
      ) => {
        set(newState, name as string, value);
        if (!isInDispatch) {
          makeEffect();
        }
      },
      setField: <K extends string | number | symbol>(
        name: K,
        value: unknown
      ): void | Promise<void> => {
        return self.setState(name, value);
      },
      dispatch: (
        key: string,
        payload: Record<string, unknown>
      ): void | Promise<void> => {
        return dispatch.call(self, modelName, key, payload);
      },
    };
    const res = effect.call(self, payload);
    const makeEffect = () => {
      const effs = effects.filter((e) => {
        return e.model === modelName && exist(newState, e.token);
      });
      merge(raw, newState);
      newState = {};
      effs.forEach((e) => {
        e.handle(get(raw, e.token));
      });
    };
    Promise.resolve(res).then(() => {
      isInDispatch = false;
      makeEffect();
    });
    return res;
  };
  return {
    effect,
    dispatch,
  };
};
