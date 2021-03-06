import Mixin from '@ember/object/mixin';
import { assert } from '@ember/debug';

export default Mixin.create({
  actions: {
    _registerSelectedOptionsContainer(container) {
      assert(
        'A select box can only have 1 selected options container',
        !this.get('selectedOptionsContainer')
      );
      this.set('selectedOptionsContainer', container);
    },

    _deregisterSelectedOptionsContainer() {
      this.set('selectedOptionsContainer', null);
    }
  }
});