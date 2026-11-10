var Styles = require('./LinkDialog.scss.g');

var DefaultButton = require('office-ui-fabric-react/lib/Button').DefaultButton;
var PrimaryButton = require('office-ui-fabric-react/lib/Button').PrimaryButton;
var Dialog = require('office-ui-fabric-react/lib/Dialog').Dialog;
var DialogFooter = require('office-ui-fabric-react/lib/Dialog').DialogFooter;
var DialogType = require('office-ui-fabric-react/lib/Dialog').DialogType;
var ITextField = require('office-ui-fabric-react/lib/TextField').ITextField;
var TextField = require('office-ui-fabric-react/lib/TextField').TextField;
var css = require('office-ui-fabric-react/lib/Utilities').css;
var KeyCodes = require('office-ui-fabric-react/lib/Utilities').KeyCodes;
var React = require('react');
var ReactDOM = require('react-dom');
var createLink = require('roosterjs-editor-api').createLink;
var Editor = require('roosterjs-editor-core').Editor;
var NullFunction = require('roosterjs-react-common').NullFunction;
var Strings = require('roosterjs-react-common').Strings;

const InsertLinkStringKeys = {
    LinkFieldLabel: "linkFieldLabel",
    Title: "linkPromptTitle",
    InsertButton: "insertLinkText",
    CancelButton: "cancelLinkText"
};

export interface LinkDialogProps {
    className?: string;
    onDismiss?: function (ev: React.FocusEvent<HTMLElement>) { return void; };
    editor: Editor;
    strings?: Strings;
    selectionRange?: Range;
}

export interface LinkDialogState {
    insertButtonDisabled: boolean;
}

class LinkDialog extends React.PureComponent<LinkDialogProps, LinkDialogState> {
    private linkField: ITextField;
    private linkInserted: boolean;

    constructor(props: LinkDialogProps) {
        super(props);

        this.state = { insertButtonDisabled: true };
    }

    public render(): JSX.Element {
        const { strings = {}, className } = this.props;

        return (
            <Dialog
                onDismiss={this.dismissDialog}
                dialogContentProps={{ type: DialogType.normal, title: strings[InsertLinkStringKeys.Title] }}
                hidden={false}
                modalProps={{ isBlocking: true }}
                className={css(Styles.modal, className)}
            >
                <TextField
                    label={strings[InsertLinkStringKeys.LinkFieldLabel] || "Link"}
                    componentRef={this.onLinkFieldRef}
                    onKeyDown={this.onLinkFieldKeyDown}
                    required={true}
                    onChange={this.onLinkFieldChanged}
                />
                <DialogFooter>
                    <PrimaryButton onClick={this.insertLink} text={strings[InsertLinkStringKeys.InsertButton] || "Insert"} disabled={this.state.insertButtonDisabled} />
                    <DefaultButton onClick={this.dismissDialog} text={strings[InsertLinkStringKeys.CancelButton] || "Cancel"} />
                </DialogFooter>
            </Dialog>
        );
    }

    public componentDidMount(): void {
        this.linkField && this.linkField.focus();
    }

    private onLinkFieldRef = (ref: ITextField): function void {
        this.linkField = ref;
    };

    private onLinkFieldChanged = (_e: any, newValue: string): function void {
        this.setState({ insertButtonDisabled: newValue.trim().length === 0 });
    };

    private onLinkFieldKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>): function void {
        if (ev.which === KeyCodes.enter) {
            this.insertLink();
            ev.preventDefault();
            ev.stopPropagation();
        }
    };

    private insertLink = (): function void {
        var editor = this.props.editor;
var selectionRange = this.props.selectionRange;

        if (!this.linkField || !editor || editor.isDisposed()) {
            return;
        }

        editor && !editor.isDisposed() && editor.select(selectionRange);
        this.linkInserted = true; // don't need to restore the selection after dismiss if we're changing selection into a link
        createLink(editor, this.linkField.value);
        this.dismissDialog();
    };

    private dismissDialog = (ev?: React.MouseEvent<HTMLButtonElement>): function void {
        var editor = this.props.editor;
var onDismiss = this.props.onDismiss;
var selectionRange = this.props.selectionRange;
        onDismiss(ev as any);
        !this.linkInserted && editor && !editor.isDisposed() && editor.select(selectionRange);
    };
}

function createLinkDialog(doc: Document, props: LinkDialogProps, calloutClassName?: string): function () { return void {
    var editor = props.editor;
var onDismiss = props.onDismiss;

    let container = doc.createElement("div");
    doc.body.appendChild(container);
    const dispose = (): void => {
        if (container) {
            ReactDOM.unmountComponentAtNode(container);

            // hack to clear placeholder and also for Firefox, to get cursor visible again
            container.setAttribute("tabindex", "0");
            calloutClassName && container.setAttribute("class", calloutClassName);
            container.focus();
            editor && !editor.isDisposed() && editor.focus();

            container.parentElement.removeChild(container);
            container = null;
        }
    };

    // for the case that selection isn't tracked, we need to save the selection before bringing up the dialog
    // and from there, we need to restore it before converting the selected text into a link or restore
    // the selection if the dialog was cancelled
    const selectionRange = editor && !editor.isDisposed() ? editor.getSelectionRange() : null;
    ReactDOM.render(
        <LinkDialog
            {...props}
            selectionRange={selectionRange}
            onDismiss={(ev: React.FocusEvent<HTMLElement>): void => {
                dispose();
                onDismiss && onDismiss(ev);
            }}
            className={css(calloutClassName, props.className)}
        />,
        container
    );

    return dispose;
}; }