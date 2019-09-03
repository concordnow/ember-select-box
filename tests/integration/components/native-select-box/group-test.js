import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('native-select-box/group', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`<NativeSelectBox::Group />`);

    assert
      .dom('optgroup.select-box-group')
      .exists({ count: 1 }, 'renders with correct class name and tag');
  });

  test('class prefix', async function(assert) {
    assert.expect(1);

    await render(hbs`<NativeSelectBox::Group @classNamePrefix="foo" />`);

    assert
      .dom('.foo-group')
      .exists({ count: 1 }, 'can override the class prefix');
  });
});
