
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
  const asJson = decoded.
    replace(/"/g, '\\"'). // Escape quotes
    replace(/&/g, '","'). // Convert & to next object
    replace(/=/g, '":"'); // Convert = to :
  const obj = JSON.parse('{"' + asJson + '"}');
  let target = {};
  for (let key in obj) {
    if (key.indexOf('.') !== -1)
      target = { ...target, ...expand(key, obj[key]) };
    else
      target[key] = obj[key];
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
      if (Array.isArray(toVal))
        target[key] = <any>toVal.concat(fromVal); // Arrays are combined
      else
        target[key] = <any>fromVal;
    } else {
      target[key] = merge(toVal, fromVal);
    }
  }
  return target;
}