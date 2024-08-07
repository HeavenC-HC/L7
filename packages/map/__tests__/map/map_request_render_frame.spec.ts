import { beforeMapTest, createMap } from '../libs/util';

beforeEach(() => {
  beforeMapTest();
});

describe('requestRenderFrame', () => {
  test('Map#_requestRenderFrame should not schedule a render frame before style load', () => {
    const map = createMap();
    const spy = jest.spyOn(map, 'triggerRepaint');
    map._requestRenderFrame(() => {});
    expect(spy).toHaveBeenCalledTimes(1);
    map.remove();
  });

  test('Map#_requestRenderFrame queues a task for the next render frame', async () => {
    const map = createMap();
    const cb = jest.fn();
    map._requestRenderFrame(cb);
    await map.once('render');
    expect(cb).toHaveBeenCalledTimes(1);
    map.remove();
  });

  test('Map#_cancelRenderFrame cancels a queued task', async () => {
    const map = createMap();
    const cb = jest.fn();
    const id = map._requestRenderFrame(cb);
    map._cancelRenderFrame(id);
    await map.once('render');
    expect(cb).toHaveBeenCalledTimes(0);
    map.remove();
  });
});
