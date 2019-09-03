import { A as emberA } from '@ember/array';
const { isArray, from } = Array;

export function buildSelection(selectBox, value1) {
  const value2 = selectBox.resolvedValue;
  const build = selectBox.onBuildSelection;

  if (typeof build === 'function') {
    return build(value1, value2);
  }

  return buildSelectionDefault(selectBox, value1, value2);
}

function buildSelectionDefault(selectBox, value1, value2) {
  let value = value1;

  if (selectBox.isMultiple && !isArray(value1)) {
    const temp = emberA(from(value2));

    if (temp.includes(value1)) {
      temp.removeObject(value1);
    } else {
      temp.addObject(value1);
    }

    value = temp.toArray();
  }

  return value;
}
