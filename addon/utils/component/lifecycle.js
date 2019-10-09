import invokeAction from './invoke-action';
import { getAPI } from './api';

export function _initComponent(component) {
  invokeAction(component, '_onInit', component);
}

export function initComponent(component) {
  _initComponent(component);

  invokeAction(component, 'onInit', getAPI(component));
}

export function _destroyComponent(component) {
  invokeAction(component, '_onDestroy', component);
}

export function destroyComponent(component) {
  invokeAction(component, 'onDestroy', getAPI(component));
}
