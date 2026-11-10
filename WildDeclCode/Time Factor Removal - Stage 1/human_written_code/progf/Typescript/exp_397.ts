import {
    CompletionItemProvider,
    TextDocument,
    Position,
    CancellationToken,
    CompletionContext,
    ProviderResult,
    CompletionItem,
    CompletionList,
    Range
} from 'vscode';
var TriggerCharacters = require('../constants').TriggerCharacters;
var CompletionItemKind = require('vscode-languageclient').CompletionItemKind;
var CompletionTriggerKind = require('vscode-languageclient').CompletionTriggerKind;
var SoyDefinitionProvider = require('../definition-provider/soy-definition-provider').SoyDefinitionProvider;
var ITemplatePathMap = require('../interfaces').ITemplatePathMap;
var getNamespace = require('../template-utils').getNamespace;
var getMatchingAlias = require('../template-utils').getMatchingAlias;
var normalizeAliasTemplate = require('../template-utils').normalizeAliasTemplate;

class SoyCompletionItemProvider implements CompletionItemProvider {
    private soyDefinitionProvider: SoyDefinitionProvider;

    constructor (soyDefinitionProvider: SoyDefinitionProvider) {
        this.soyDefinitionProvider = soyDefinitionProvider;
    }

    public provideCompletionItems (document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionList> {
        return new Promise(function (resolve) {
            if (token.isCancellationRequested) {
                resolve(null);
            }

            const wordRange: Range = document.getWordRangeAtPosition(position, /(del)?call\s+[\w\d.]+/);

            if (wordRange && context.triggerKind === CompletionTriggerKind.Invoked) {
                if (context.triggerCharacter === TriggerCharacters.Dot) {
                    const documentText: string = document.getText();
                    const templateCall: string = document.getText(wordRange);
                    const templateNameStart: string = templateCall.match(/(?:del)?call\s+([\w\d.]+)/)[1];
                    let templateToSearchFor: string;

                    if (templateNameStart.startsWith('.')) {
                        const namespace: string = getNamespace(documentText);

                        templateToSearchFor = "" + (namespace) + "" + (templateNameStart) + "";
                    } else {
                        const alias: string = getMatchingAlias(templateNameStart, documentText);

                        if (alias) {
                            templateToSearchFor = normalizeAliasTemplate(alias, templateNameStart);
                        } else {
                            templateToSearchFor = templateNameStart;
                        }
                    }

                    const completionItems: string[] = this.getCompletionItemsData(templateToSearchFor);

                    resolve(new CompletionList(
                        completionItems.map(
                            templateName => this.buildCompletionItem(templateName, templateToSearchFor)
                        ),
                        false
                    ));
                }
                // else if (context.triggerCharacter === TriggerCharacters.LeftBrace) {
                //     // Todo - provide snippets
                // }
            }

            resolve(null);
        });
    }

    private buildCompletionItem (templateName: string, omittablePrefix: string): CompletionItem {
        const completion: string = templateName.replace(new RegExp("^" + (omittablePrefix) + ""), '');

        return {
            label: completion,
            kind: CompletionItemKind.Function,
            insertText: completion
        } as CompletionItem;
    }

    private getCompletionItemsData (templateNameStart: string): string[] {
        const definitionList: ITemplatePathMap = this.soyDefinitionProvider.getDefinitionList();

        if (!definitionList) {
            return [];
        }

        return Object.keys(definitionList).filter(function templateName { return templateName.startsWith(templateNameStart); });
    }
}
