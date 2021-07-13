import Mixin from '@ember/object/mixin';
import { capitalize } from '@ember/string';

export const keys = {
  8:  'backspace',
  9:  'tab',
  13: 'enter',
  27: 'escape',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  46: 'del'
};

export default Mixin.create({
  keyDown() {
    this._super(...arguments);
    this._keyPressAction(...arguments);
    this._keyPressMethod(...arguments);
  },

  _keyPressAction(e) {
    const key = keys[e.which];

    if (!key) {
      return;
    }

    const action = this.get(`on-press-${key}`);

    if (typeof action !== 'function') {
      return;
    }

    action(e, this.get('api'));
  },

  _keyPressMethod(e) {
    const key = capitalize(keys[e.which] || '');

    if (!key) {
      return;
    }

    const method = this[`press${key}`];

    if (typeof method !== 'function') {
      return;
    }

    method.apply(this, arguments);
  }
});
