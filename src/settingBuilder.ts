
export function expand(key, value) {
  const result = {};
  const split = key.split('.');
  let target = result;
  const last = split.pop();
  for (let part of split) {
    target = target[part] = {};
  }
  target[last] = value;
  return result;
}

function hasOwn<T, K>(obj: T, key: K): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function queryStringToObject(search = location.search): any {
  const decoded = decodeURI(search.substring(1));
  let target = {};
  let pairs = decoded.split("?").pop().split("&");
  for (let part of pairs) {
    var kv = part.split("=");
    if (kv[0].indexOf('.') !== -1)
      target = merge(target, expand(kv[0], kv[1]));
    else
      target[kv[0]] = kv[1];
  }
  return target;
}

function clone<T>(a: T): T {
  return JSON.parse(JSON.stringify(a));
}

function isValue(x: any): x is string | number | symbol {
  return typeof x === 'string' || typeof x === 'number' || typeof x === 'symbol';
}

export function merge<T, U>(to: T, from: U): T & U {
  let target = <T & U>clone(to);

  for (let key in from) {
    const fromVal = (<any>from)[key];
    const toVal = (<any>target)[key];

    if (isValue(fromVal)) {
      target[key] = <any>fromVal; // Values are replaced
    } else if (Array.isArray(fromVal)) {
      target[key] = Array.isArray(toVal) ? <any>toVal.concat(fromVal) : <any>fromVal; // Arrays are combined
    } else {
      target[key] = toVal ? merge(toVal, fromVal) : fromVal;
    }
  }
  return target;
}