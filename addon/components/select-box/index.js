import Component from '@glimmer/component';
import { isPresent } from '@ember/utils';
import {
  _selectOption,
  selectOption
} from '../../utils/select-box/option/select';
import {
  deactivateOptions,
  activateNextOption,
  activateOption,
  activateOptionAtIndex,
  activateOptionForKeyCode,
  activateOptionForValue,
  activatePreviousOption
} from '../../utils/select-box/option/activate';
import { blurInput, focusInput } from '../../utils/select-box/input/focus';
import {
  cancelSearch,
  maybeSearch,
  search
} from '../../utils/select-box/search';
import { close, open, toggle } from '../../utils/select-box/toggle';
import {
  deregisterElement,
  registerElement
} from '../../utils/registration/element';
import { deregisterInput, registerInput } from '../../utils/registration/input';
import {
  deregisterOption,
  registerOption
} from '../../utils/registration/option';
import {
  deregisterOptionsContainer,
  registerOptionsContainer
} from '../../utils/registration/options-container';
import { focusOut } from '../../utils/select-box/focus';
import { keyDown, keyPress, pressEnter } from '../../utils/select-box/keyboard';
import { setInputValue } from '../../utils/select-box/input/value';
import buildAPI from '../../utils/shared/api';
import {
  receiveValue,
  selectValue,
  updateValue
} from '../../utils/shared/value';
import buildID from '../../utils/shared/id';
import { ready } from '../../utils/shared/ready';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A as emberA } from '@ember/array';

export default class SelectBox extends Component {
  _api = {};
  element = null;
  optionCharState = null;
  pendingOptions = emberA();
  previousValue = null;
  searchID = 0;
  valueID = 0;

  Group = null;
  Input = null;
  Option = null;
  Options = null;
  SelectedOption = null;
  SelectedOptions = null;

  @tracked activeOptionIndex = -1;
  @tracked input = null;
  @tracked isFulfilled = false;
  @tracked isOpen = false;
  @tracked isPending = true;
  @tracked isReady = false;
  @tracked isRejected = false;
  @tracked isSearching = false;
  @tracked isSettled = false;
  @tracked isSlowSearch = false;
  @tracked options = [];
  @tracked optionsContainer = null;
  @tracked value = null;

  get api() {
    return buildAPI(this, [
      // Components
      'Group',
      'Input',
      'Option',
      'Options',
      'SelectedOption',
      'SelectedOptions',
      // Properties
      'element',
      'isBusy',
      'isDisabled',
      'isFulfilled',
      'isMultiple',
      'isOpen',
      'isPending',
      'isRejected',
      'isSearching',
      'isSettled',
      'isSlowSearch',
      'value',
      // Actions
      'activateNextOption',
      'activateOptionAtIndex',
      'activateOptionForKeyCode',
      'activateOptionForValue',
      'activatePreviousOption',
      'blurInput',
      'cancelSearch',
      'close',
      'deactivateOptions',
      'focusInput',
      'open',
      'search',
      'select',
      'selectActiveOption',
      'setInputValue',
      'toggle',
      'update'
    ]);
  }

  get activeOption() {
    return this.options[this.activeOptionIndex];
  }

  get id() {
    return buildID(this);
  }

  get role() {
    return this.input ? 'combobox' : 'listbox';
  }

  get isListbox() {
    return this.role === 'listbox';
  }

  get isCombobox() {
    return this.role === 'combobox';
  }

  get tabIndex() {
    return this.isDisabled || this.isCombobox ? null : '0';
  }

  get isBusy() {
    return this.isPending || this.isSearching;
  }

  get isDisabled() {
    return this.args.disabled;
  }

  get isMultiple() {
    return this.args.multiple;
  }

  get isMultiSelectable() {
    return this.isMultiple && this.isListbox;
  }

  get searchDelayTime() {
    return isPresent(this.args.searchDelayTime)
      ? this.args.searchDelayTime
      : 100;
  }

  get searchMinChars() {
    return isPresent(this.args.searchMinChars) ? this.args.searchMinChars : 1;
  }

  get searchSlowTime() {
    return isPresent(this.args.searchSlowTime) ? this.args.searchSlowTime : 500;
  }

  constructor() {
    super(...arguments);
    receiveValue(this);
  }

  @action
  handleInsertElement(element) {
    registerElement(this, element);
    ready(this);
  }

  @action
  handleDestroyElement() {
    deregisterElement(this);
  }

  @action
  handleUpdateValue() {
    receiveValue(this);
  }

  @action
  handleInsertOption(option) {
    registerOption(this, option);
  }

  @action
  handleDestroyOption(option) {
    deregisterOption(this, option);
  }

  @action
  handleInsertInput(input) {
    registerInput(this, input);
  }

  @action
  handleDestroyInput(input) {
    deregisterInput(this, input);
  }

  @action
  handleInputText(text) {
    maybeSearch(this, text);
  }

  @action
  handleInsertOptionsContainer(optionsContainer) {
    registerOptionsContainer(this, optionsContainer);
  }

  @action
  handleDestroyOptionsContainer(optionsContainer) {
    deregisterOptionsContainer(this, optionsContainer);
  }

  @action
  handleFocusOut(e) {
    focusOut(this, e);
  }

  @action
  handleKeyPress(e) {
    keyPress(this, e);
  }

  @action
  handleKeyDown(e) {
    keyDown(this, e);
  }

  @action
  handlePressEnter(e) {
    pressEnter(this, e);
  }

  @action
  handleSelectOption(option) {
    selectOption(this, option);
  }

  @action
  handleActivateOption(option) {
    activateOption(this, option);
  }

  @action
  select(value) {
    return selectValue(this, value);
  }

  @action
  update(value) {
    return updateValue(this, value);
  }

  @action
  selectActiveOption() {
    if (!this.activeOption) {
      return;
    }

    return _selectOption(this.activeOption);
  }

  @action
  open() {
    open(this);
  }

  @action
  close() {
    close(this);
  }

  @action
  toggle() {
    toggle(this);
  }

  @action
  search(query) {
    return search(this, query);
  }

  @action
  cancelSearch() {
    cancelSearch(this);
  }

  @action
  focusInput() {
    focusInput(this);
  }

  @action
  blurInput() {
    blurInput(this);
  }

  @action
  setInputValue(value) {
    setInputValue(this, value);
  }

  @action
  activateOptionForValue(value, config) {
    activateOptionForValue(this, value, config);
  }

  @action
  activateOptionAtIndex(index, config) {
    activateOptionAtIndex(this, index, config);
  }

  @action
  activateNextOption(config) {
    activateNextOption(this, config);
  }

  @action
  activatePreviousOption(config) {
    activatePreviousOption(this, config);
  }

  @action
  activateOptionForKeyCode(keyCode, config) {
    activateOptionForKeyCode(this, keyCode, config);
  }

  @action
  deactivateOptions() {
    deactivateOptions(this);
  }
}
