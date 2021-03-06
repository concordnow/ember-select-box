import Component from '@ember/component';
import BaseSelectBox from '../../mixins/select-box/base';
import layout from '../../templates/components/select-box/native';
import { A as emberA } from '@ember/array';

export default Component.extend(BaseSelectBox, {
  layout,
  tagName: 'select',
  attributeBindings: [
    'name',
    'title',
    'tabindex',
    'disabled',
    'size',
    'multiple',
    'autofocus',
    'required',
    'aria-label'
  ],

  change() {
    const registeredSelected   = this._getRegisteredSelectedValues();
    const unregisteredSelected = this._getUnregisteredSelectedValues();

    let selectedValues;

    if (registeredSelected.length > 0) {
      selectedValues = registeredSelected;
    } else {
      selectedValues = unregisteredSelected;
    }

    if (this.get('multiple')) {
      this.send('select', selectedValues);
    } else {
      this.send('select', selectedValues[0]);
    }
  },

  _getRegisteredSelectedValues() {
    return emberA(
      this.get('options')
        .filter(option => option.get('element.selected'))
        .map(option => option.get('value'))
    );
  },

  _getUnregisteredSelectedValues() {
    return emberA(
      [].slice.call(this.get('element').querySelectorAll('option:checked'))
        .map(option => option.value)
    );
  }
});
