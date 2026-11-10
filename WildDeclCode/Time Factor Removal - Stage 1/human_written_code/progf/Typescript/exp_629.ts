var WFWorkflow = require('../../src/interfaces/WF/WFWorkflow');
var WFWorkflowAction = require('../../src/interfaces/WF/WFWorkflowAction');

const testActions: WFWorkflowAction[] = [
  {
    WFWorkflowActionIdentifier: 'is.workflow.actions.comment',
    WFWorkflowActionParameters: {
      WFCommentActionText: 'This is a test!',
    },
  }, {
    WFWorkflowActionIdentifier: 'is.workflow.actions.number',
    WFWorkflowActionParameters: {
      WFNumberActionNumber: 42,
    },
  }, {
    WFWorkflowActionIdentifier: 'is.workflow.actions.math',
    WFWorkflowActionParameters: {
      WFMathOperand: 19,
      WFMathOperation: '+',
    },
  },
];

const testShortcutNoActions: WFWorkflow = {
  WFWorkflowClientVersion: '724',
  WFWorkflowClientRelease: '2.1',
  WFWorkflowIcon: {
    WFWorkflowIconStartColor: 4274264319,
    WFWorkflowIconGlyphNumber: 59446,
  },
  WFWorkflowImportQuestions: [],
  WFWorkflowTypes: [
    'WatchKit',
    'NCWidget',
  ],
  WFWorkflowInputContentItemClasses: [
    'WFAppStoreAppContentItem',
    'WFArticleContentItem',
    'WFContactContentItem',
    'WFDateContentItem',
    'WFEmailAddressContentItem',
    'WFGenericFileContentItem',
    'WFImageContentItem',
    'WFiTunesProductContentItem',
    'WFLocationContentItem',
    'WFDCMapsLinkContentItem',
    'WFAVAssetContentItem',
    'WFPDFContentItem',
    'WFPhoneNumberContentItem',
    'WFRichTextContentItem',
    'WFSafariWebPageContentItem',
    'WFStringContentItem',
    'WFURLContentItem',
  ],
  WFWorkflowActions: [],
};

const testShortcutNoActionsNoWidget: WFWorkflow = {
  WFWorkflowClientVersion: '724',
  WFWorkflowClientRelease: '2.1',
  WFWorkflowIcon: {
    WFWorkflowIconStartColor: 4274264319,
    WFWorkflowIconGlyphNumber: 59446,
  },
  WFWorkflowImportQuestions: [],
  WFWorkflowTypes: [
    'WatchKit',
  ],
  WFWorkflowInputContentItemClasses: [
    'WFAppStoreAppContentItem',
    'WFArticleContentItem',
    'WFContactContentItem',
    'WFDateContentItem',
    'WFEmailAddressContentItem',
    'WFGenericFileContentItem',
    'WFImageContentItem',
    'WFiTunesProductContentItem',
    'WFLocationContentItem',
    'WFDCMapsLinkContentItem',
    'WFAVAssetContentItem',
    'WFPDFContentItem',
    'WFPhoneNumberContentItem',
    'WFRichTextContentItem',
    'WFSafariWebPageContentItem',
    'WFStringContentItem',
    'WFURLContentItem',
  ],
  WFWorkflowActions: [],
};

const testShortcutWithActions: WFWorkflow = {
  WFWorkflowClientVersion: '724',
  WFWorkflowClientRelease: '2.1',
  WFWorkflowIcon: {
    WFWorkflowIconStartColor: 4274264319,
    WFWorkflowIconGlyphNumber: 59446,
  },
  WFWorkflowImportQuestions: [],
  WFWorkflowTypes: [
    'WatchKit',
    'NCWidget',
  ],
  WFWorkflowInputContentItemClasses: [
    'WFAppStoreAppContentItem',
    'WFArticleContentItem',
    'WFContactContentItem',
    'WFDateContentItem',
    'WFEmailAddressContentItem',
    'WFGenericFileContentItem',
    'WFImageContentItem',
    'WFiTunesProductContentItem',
    'WFLocationContentItem',
    'WFDCMapsLinkContentItem',
    'WFAVAssetContentItem',
    'WFPDFContentItem',
    'WFPhoneNumberContentItem',
    'WFRichTextContentItem',
    'WFSafariWebPageContentItem',
    'WFStringContentItem',
    'WFURLContentItem',
  ],
  WFWorkflowActions: testActions,
};

const testShortcutWithModifiedOptions: WFWorkflow = {
  WFWorkflowClientVersion: '724',
  WFWorkflowClientRelease: '2.1',
  WFWorkflowIcon: {
    WFWorkflowIconStartColor: 3980825855,
    WFWorkflowIconGlyphNumber: 59769,
  },
  WFWorkflowImportQuestions: [],
  WFWorkflowTypes: [
    'WatchKit',
    'NCWidget',
  ],
  WFWorkflowInputContentItemClasses: [
    'WFAppStoreAppContentItem',
    'WFArticleContentItem',
    'WFContactContentItem',
    'WFDateContentItem',
    'WFEmailAddressContentItem',
    'WFGenericFileContentItem',
    'WFImageContentItem',
    'WFiTunesProductContentItem',
    'WFLocationContentItem',
    'WFDCMapsLinkContentItem',
    'WFAVAssetContentItem',
    'WFPDFContentItem',
    'WFPhoneNumberContentItem',
    'WFRichTextContentItem',
    'WFSafariWebPageContentItem',
    'WFStringContentItem',
    'WFURLContentItem',
  ],
  WFWorkflowActions: testActions,
};
