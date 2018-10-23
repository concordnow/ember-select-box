import Mixin from '@ember/object/mixin';
import { capitalize } from '@ember/string';
import invokeAction from '../../../utils/invoke-action';

const keys = {
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
    const actionName = `on-press-${key}`;
    invokeAction(this, actionName, e, this.get('api'));
  },

  _keyPressMethod(e) {
    const key = capitalize(keys[e.which] || '');
    if (!key) {
      return;
    }
    const methodName = `press${key}`;
    const func = this[methodName];
    if (typeof func === 'function') {
      func.apply(this, arguments);
    }
  }
});
