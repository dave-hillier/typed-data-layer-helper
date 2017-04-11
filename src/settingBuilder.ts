
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
    const fromValue = (<any>from)[key];
    const toValue = (<any>target)[key];

    if (isValue(fromValue) || !toValue) {
      target[key] = <any>fromValue; // Values are replaced
    } else if (Array.isArray(fromValue)) {
      target[key] = Array.isArray(toValue) ? <any>toValue.concat(fromValue) : <any>fromValue; // Arrays are combined
    } else {
      target[key] = merge(toValue, fromValue);
    }
  }
  return target;
}

export function getScriptUrl(scriptName) {
  const scripts: any[] = Array.prototype.slice.call(document.getElementsByTagName("script")); // TODO: correct type?
  const matching = scripts.filter(s => s.src.indexOf('/' + scriptName));
  if (matching.length > 0) {
    return matching[0].src;
  }
  console.error('No scripts matching: ' + scriptName);
  return '';
}