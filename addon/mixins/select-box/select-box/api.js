import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { bind } from '@ember/runloop';

export default Mixin.create({
  api: computed(function() {
    const expose = {};
    [
      'open',
      'close',
      'toggle',
      'select',
      'update',
      'selectActiveOption',
      'search',
      'stopSearching',
      'setInputValue',
      'focusInput',
      'blurInput',
      'activateOptionAtIndex',
      'activateNextOption',
      'activatePreviousOption',
      'deactivateOptions',
      'activateSelectedOptionAtIndex',
      'activateNextSelectedOption',
      'activatePreviousSelectedOption',
      'deactivateSelectedOptions'
    ].forEach(actionName => {
      expose[actionName] = bind(this, this.get(`actions.${actionName}`));
    });
    return expose;
  })
});
