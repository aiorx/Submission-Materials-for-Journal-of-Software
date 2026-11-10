/**
 * @license
 *
 * Copyright IBM Corp. 2019, 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

var _import = require('react');
var PropTypes = require('prop-types');
var Form = require('@storybook/components').Form;
var CURRENT_THEME = require('../shared').CURRENT_THEME;

/**
 * Storybook add-on panel for Carbon theme switcher.
 */
var Panel = function ({ api, active }) {
  var [currentTheme, setCurrentTheme] = useState('white');
  var handleChange = useCallback(
    event => {
      var value = event.target.value;
      setCurrentTheme(value);
      api.getChannel().emit(CURRENT_THEME, value);
    },
    [api]
  );
  return (
    active && (
      <Form translate="yes">
        <Form.Field label="Select Carbon theme:">
          <Form.Select translate="yes" name="carbon-theme" value={currentTheme} onChange={handleChange} size="flex">
            <option key="white" value="white">
              white
            </option>
            <option key="g10" value="g10">
              g10
            </option>
            <option key="g90" value="g90">
              g90
            </option>
            <option key="g100" value="g100">
              g100
            </option>
          </Form.Select>
        </Form.Field>
      </Form>
    )
  );
};

Panel.propTypes = {
  /**
   * The Storybook API object.
   */
  api: PropTypes.shape({
    getChannel: PropTypes.func,
  }).isRequired,

  /**
   * `true` if this Storybook add-on panel is active.
   */
  active: PropTypes.bool.isRequired,
};

module.exports = Panel;
