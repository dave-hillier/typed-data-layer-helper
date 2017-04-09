import * as settingBuilder from '../src/settingBuilder';

describe('settingBuilder', function () {
  it('single parameter', function () {
    const result = settingBuilder.queryStringToObject('?arg1=value1');
    expect(result).toEqual({ arg1: 'value1' });
  });
  it('multiple parameters', function () {
    const result = settingBuilder.queryStringToObject('?arg1=value1&arg2=value2&arg3=value3');
    expect(result).toEqual({ 
      arg1: 'value1',
      arg2: 'value2',
      arg3: 'value3'
    });
  });
  it('nested parameter', function () {
    const result = settingBuilder.queryStringToObject('?a.b=value1');
    expect(result).toEqual({ a: { b: 'value1' } });
  });
});