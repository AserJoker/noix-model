const mixed = (raw: unknown, _new: unknown): unknown => {
  const _newObject = _new as Record<string, unknown>;
  const rawObject = raw as Record<string, unknown>;
  return new Proxy(
    {},
    {
      get: (_target, name: string) => {
        if (Object.keys(_newObject).includes(name)) {
          const value = _newObject[name];
          if (typeof value === "object" && value) {
            if (typeof rawObject[name] === "object" && rawObject[name]) {
              return mixed(rawObject[name], value);
            }
            return value;
          }
        }
        return rawObject[name];
      },
      set: () => false,
    }
  );
};
const get = <T>(obj: Record<string, unknown>, path: string) => {
  const patharr = path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  return patharr.reduce((last, name, index): unknown => {
    const value = (last as Record<string, unknown>)[name];
    if (index !== patharr.length - 1) {
      return value || {};
    }
    return value;
  }, obj as unknown) as T;
};
const merge = (raw: Record<string, unknown>, obj: Record<string, unknown>) => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === "object" && value) {
      merge(
        raw[key] as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      raw[key] = obj[key];
    }
  });
};
const exist = (obj: Record<string, unknown>, path: string) => {
  const patharr = path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  let p = obj;
  for (let index = 0; index < patharr.length; index++) {
    if (!Object.keys(p).includes(patharr[index])) {
      return false;
    }
    try {
      p = p[patharr[index]] as Record<string, unknown>;
    } catch (e) {
      return false;
    }
  }
  return true;
};
const set = (obj: Record<string, unknown>, path: string, v: unknown) => {
  const patharr = path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  patharr.reduce((last, name, index): unknown => {
    const value = (last as Record<string, unknown>)[name];
    if (index !== patharr.length - 1) {
      if (!value) {
        if (!isNaN(Number(name))) {
          (last as Record<string, unknown>)[name] = [];
        } else {
          (last as Record<string, unknown>)[name] = {};
        }
        return (last as Record<string, unknown>)[name];
      }
      return value;
    }
    (last as Record<string, unknown>)[name] = v;
    return;
  }, obj as unknown);
};
export { set, get, exist, merge, mixed };
