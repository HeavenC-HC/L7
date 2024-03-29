import { gl } from '@antv/l7-core';

import { glContext } from '@antv/l7-test-utils';
import regl from 'regl';
import quad from '../../../core/src/shaders/post-processing/quad.glsl';
import ReglAttribute from '../../src/regl/ReglAttribute';
import ReglBuffer from '../../src/regl/ReglBuffer';
import ReglElements from '../../src/regl/ReglElements';
import ReglModel from '../../src/regl/ReglModel';
import checkPixels from './utils/check-pixels';

describe('ReglElements', () => {
  let reGL: regl.Regl;

  beforeEach(() => {
    reGL = regl(glContext);
  });

  it('should initialize correctly', () => {
    const model = new ReglModel(reGL, {
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: new ReglAttribute(reGL, {
          buffer: new ReglBuffer(reGL, {
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      depth: {
        enable: false,
      },
      elements: new ReglElements(reGL, {
        data: [0, 1, 2],
        count: 3,
      }),
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    model.draw({});

    expect(checkPixels(reGL, [255])).toBeTruthy();
  });

  it('should update correctly', () => {
    const elements = new ReglElements(reGL, {
      data: [0, 1, 2],
      count: 3,
    });
    const model = new ReglModel(reGL, {
      vs: quad,
      fs: 'void main() {gl_FragColor = vec4(1., 0., 0., 1.);}',
      attributes: {
        a_Position: new ReglAttribute(reGL, {
          buffer: new ReglBuffer(reGL, {
            data: [-4, -4, 4, -4, 0, 4],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      depth: {
        enable: false,
      },
      elements,
    });

    reGL.clear({
      color: [0, 0, 0, 0],
    });

    elements.subData({
      data: [0, 1, 2],
    });

    model.draw({});

    elements.destroy();

    expect(checkPixels(reGL, [255])).toBeTruthy();
  });
});
