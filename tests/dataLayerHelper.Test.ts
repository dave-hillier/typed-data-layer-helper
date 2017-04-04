import * as dataLayerHelper from '../src/dataLayerHelper';

describe('DataLayerHelper', function() {
  const testEvent = {'key':'value'};

  it('subscribe already has event gets callback', function() {
    const dataLayer = [testEvent];
    const callback = jasmine.createSpy('callback');
    dataLayerHelper.subscribe(dataLayer, callback);
    expect(callback).toHaveBeenCalledWith(testEvent);
  });

  it('subscribe after event pushed gets callback', function() {
    const dataLayer = [];
    dataLayer.push(testEvent);
    const callback = jasmine.createSpy('callback');

    dataLayerHelper.subscribe(dataLayer, callback);
    expect(callback).toHaveBeenCalledWith(testEvent);
  });

  it('subscribe before event pushed gets callback', function() {
    const dataLayer = [];
    const callback = jasmine.createSpy('callback');

    dataLayerHelper.subscribe(dataLayer, callback);
    dataLayer.push(testEvent);

    expect(callback).toHaveBeenCalledWith(testEvent);
  });

  it('two events before subscribe', function() {
    const testEvent1 = {'event':'1'};
    const testEvent2 = {'event':'2'};
    const dataLayer = [testEvent1, testEvent2];
    const callback = jasmine.createSpy('callback');

    dataLayerHelper.subscribe(dataLayer, callback);

    expect(callback).toHaveBeenCalledWith(testEvent1);
    expect(callback).toHaveBeenCalledWith(testEvent2);
  });

  it('two events after subscribe', function() {
    const testEvent1 = {'event':'1'};
    const testEvent2 = {'event':'2'};


    const dataLayer = [];
    const callback = jasmine.createSpy('callback');

    dataLayerHelper.subscribe(dataLayer, callback);
    dataLayer.push(testEvent1);
    dataLayer.push(testEvent2);

    expect(callback).toHaveBeenCalledWith(testEvent1);
    expect(callback).toHaveBeenCalledWith(testEvent2);
  });

  it('callback that generates events', function() {
    const testEvent1 = {'event':'1'};
    const testEvent2 = {'event':'2'};

    const dataLayer = [];
    let callbackCount = 0

    dataLayerHelper.subscribe(dataLayer, (evt) => {
      ++callbackCount;
      if (evt === testEvent1)
        dataLayer.push(testEvent2);
    });
    dataLayer.push(testEvent1);

    expect(callbackCount).toBe(2);
  });

  it('ignore old events', function() {
    const testEvent1 = {'event':'1'};
    const testEvent2 = {'event':'2'};
    const dataLayer = [testEvent1];
    const callback = jasmine.createSpy('callback');

    dataLayerHelper.subscribe(dataLayer, callback, false);
    dataLayer.push(testEvent2);
    
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(testEvent2);
  });
});