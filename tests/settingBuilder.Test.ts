import * as settingBuilder from '../src/settingBuilder';

describe('settingBuilder', function () {
  describe('queryStringToObject', function () {
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
    
    it('two nested parameter', function () {
      const result = settingBuilder.queryStringToObject('?a.b=value1&a.c=value1');
      expect(result).toEqual({ a: { b: 'value1', c: 'value1' } });
    });    
  });

  describe('merge', function () {

    it('empty', function () {
      const result = settingBuilder.merge({ a: 1 }, {});
      expect(result).toEqual({ a: 1 });
    });

    it('into empty', function () {
      const result = settingBuilder.merge({ }, { a: 2 });
      expect(result).toEqual({ a: 2 });
    });

    it('nested into empty', function () {
      const result = settingBuilder.merge({ }, { a: {b :2 } });
      expect(result).toEqual({ a: {b :2 } });
    });

    it('single field', function () {
      const result = settingBuilder.merge({ a: 1 }, { a: 2 });
      expect(result).toEqual({ a: 2 });
    });

    it('separate fields', function () {
      const result = settingBuilder.merge({ a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('nested objects', function () {
      const result = settingBuilder.merge({ a: { c: 1 } }, { a: { b: 2 } });
      expect(result).toEqual({ a: { c: 1, b: 2 } });
    });

    it('array field', function () {
      const result = settingBuilder.merge({ a: [1] }, { a: [2] });
      expect(result).toEqual({ a: [1, 2] });
    });
  });
});