var ComponentInfo = require('../components').ComponentInfo;
var BaseComponent = require('../entities').BaseComponent;
var checkmark = require('../utils').checkmark;
var indexByOptionId = require('../utils').indexByOptionId;
var stringArray = require('../utils').stringArray;

const componentId = 'alert';

export interface Alert extends BaseComponent {
  componentId: typeof componentId;
  options: {
    closable: boolean;
    types: string[] | null;
  };
}

const alertComponent: ComponentInfo = {
  cannonicalName: 'Alert',
  componentId,
  description: 'Alerts are used to show an important message to users.',
  indefiniteArticle: 'an',
  optionsById: indexByOptionId([
    {
      criteria: 'The alert has ready-made variations.',
      name: 'Types',
      optionId: 'types',
      ...stringArray,
    },
    {
      criteria: 'The alert has an "out of the box" way to dismiss, usually with an `onClose` prop.',
      name: 'Closable',
      optionId: 'closable',
      ...checkmark,
    },
  ]),
};
