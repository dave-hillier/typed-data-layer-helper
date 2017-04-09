
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

export function mergeRecursive<T, U>(to: T, from: U): T & U {
  let target = <T & U>clone(to);

  for (let key in from) {
    if (!hasOwn(from, key)) { // TODO: why would this be true?
      continue;
    }

    const fromVal = (<any>from)[key];
    const toVal = (<any>target)[key];

    if (!hasOwn(target, key)) {
      target[key] = clone(fromVal);
    } else {
      target[key] = mergeRecursive(toVal, fromVal);
    }
    // TODO: do I need array support?
  }
  return target;
}