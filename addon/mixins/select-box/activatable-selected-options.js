import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import scrollIntoView from '../../utils/select-box/scroll-into-view';

export default Mixin.create({
  init() {
    this._super(...arguments);
    this._deactivateSelectedOptions();
  },

  _activateSelectedOptionAtIndex(index, scroll) {
    const under = index < 0;
    const over  = index > this.get('selectedOptions.length') - 1;
    if (!(under || over)) {
      this.set('activeSelectedOptionIndex', index);
      this._activatedSelectedOption();
    }
    if (scroll) {
      this._scrollActiveSelectedOptionIntoView();
    }
  },

  _activatedSelectedOption() {
    const activeSelectedOption = this.get('activeSelectedOption');
    if (activeSelectedOption) {
      activeSelectedOption.send('_activate');
    }
  },

  _deactivateSelectedOptions() {
    this.set('activeSelectedOptionIndex', -1);
  },

  _scrollActiveSelectedOptionIntoView() {
    scrollIntoView(this.get('activeSelectedOption.element'));
  },

  activeSelectedOption: computed('activeSelectedOptionIndex', 'selectedOptions',
    function() {
      const index = this.get('activeSelectedOptionIndex');
      return this.get('selectedOptions').objectAt(index);
    }),

  actions: {
    activateSelectedOptionAtIndex(index, scroll) {
      this._activateSelectedOptionAtIndex(index, scroll);
    },

    activateNextSelectedOption(scroll) {
      const next = this.get('activeSelectedOptionIndex') + 1;
      this._activateSelectedOptionAtIndex(next, scroll);
    },

    activatePreviousSelectedOption(scroll) {
      const prev = this.get('activeSelectedOptionIndex') - 1;
      this._activateSelectedOptionAtIndex(prev, scroll);
    },

    deactivateSelectedOptions() {
      this._deactivateSelectedOptions();
    }
  }
});
