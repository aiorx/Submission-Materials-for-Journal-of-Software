var WFWorkflowAction = require('../../src/interfaces/WF/WFWorkflowAction');

const compareObjectsWithGroupingIdentifier = function (
  actual: WFWorkflowAction | WFWorkflowAction[],
  expected: WFWorkflowAction[],
) {
  const actualArr = Array.isArray(actual) ? actual : [actual];

  expect.assertions(expected.length);

  expected.forEach((obj, idx) => {
    const actualObj = actualArr[idx];
    const expectedObj = {
      ...obj,
    };

    var GroupingIdentifier = actualObj.WFWorkflowActionParameters.GroupingIdentifier;
    if (GroupingIdentifier) {
      expectedObj.WFWorkflowActionParameters.GroupingIdentifier = GroupingIdentifier;
    }

    expect(actualArr[idx]).toEqual(expectedObj);
  });
};
