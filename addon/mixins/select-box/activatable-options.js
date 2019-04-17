import Mixin from '@ember/object/mixin';
import { computed, get, set } from '@ember/object';
import scrollIntoView from '../../utils/select-box/scroll-into-view';
import { isAlphaNumericChar } from '../../utils/alpha-num';
import { later, cancel } from '@ember/runloop';
const { fromCharCode } = String;

export default Mixin.create({
  init() {
    this._super(...arguments);
    this._deactivateOptions();
  },

  _activateOptionAtIndex(index, scroll) {
    const under = index < 0;
    const over = index > this.options.length - 1;

    if (!(under || over)) {
      set(this, 'activeOptionIndex', index);
      this._activatedOption();
    }

    if (scroll) {
      this._scrollActiveOptionIntoView();
    }
  },

  _activateOptionForChar(char, scroll) {
    cancel(this.activateOptionCharTimer);

    const timer = later(this, '_resetActivateOptionChars', 1000);
    const index = this.activateOptionCharIndex || 0;
    const lastChars = this.activateOptionChars || '';
    const lastChar = lastChars.substring(lastChars.length - 1);
    const chars = lastChars + char;

    let options;
    let option;

    if (lastChar && lastChar === char) {
      options = this._findOptionsMatchingChars(char);
      option = options[index];
    } else {
      options = this._findOptionsMatchingChars(chars);
      option = options[0];
    }

    set(this, 'activateOptionChars', chars);
    set(this, 'activateOptionCharTimer', timer);
    set(this, 'activateOptionCharIndex', index >= options.length - 1 ? 0 : index + 1);

    if (option) {
      this.send('activateOptionAtIndex', get(option, 'index'), scroll);
    }
  },

  _findOptionsMatchingChars(chars) {
    const pattern = new RegExp(`^${chars}`, 'i');

    return this.options.filter(option => {
      return pattern.test(option.element.textContent.trim());
    });
  },

  _resetActivateOptionChars() {
    set(this, 'activateOptionChars', '');
  },

  _activatedOption() {
    if (this.activeOption) {
      this.activeOption.send('_activated');
    }
  },

  _deactivateOptions() {
    set(this, 'activeOptionIndex', -1);
  },

  _scrollActiveOptionIntoView() {
    if (this.activeOption) {
      scrollIntoView(this.activeOption.element);
    }
  },

  activeOption: computed('activeOptionIndex', 'options', function() {
    return this.options.objectAt(this.activeOptionIndex);
  }),

  actions: {
    activateOptionAtIndex(index, scroll = false) {
      this._activateOptionAtIndex(index, scroll);
    },

    activateNextOption(scroll = true) {
      const next = this.activeOptionIndex + 1;
      this._activateOptionAtIndex(next, scroll);
    },

    activatePreviousOption(scroll = true) {
      const prev = this.activeOptionIndex - 1;
      this._activateOptionAtIndex(prev, scroll);
    },

    activateOptionForKeyCode(keyCode, scroll = true) {
      const char = fromCharCode(keyCode);

      if (isAlphaNumericChar(char)) {
        this._activateOptionForChar(char, scroll);
      }
    },

    deactivateOptions() {
      this._deactivateOptions();
    }
  }
});
