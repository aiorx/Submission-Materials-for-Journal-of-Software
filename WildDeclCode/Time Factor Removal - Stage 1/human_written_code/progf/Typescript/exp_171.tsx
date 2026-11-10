var React = require('react');
var MUIRichTextEditor = require('../../');

const save = function (data: string) {
    console.log(data)
}

const Basic = function () {
    return (
        <MUIRichTextEditor
            label="Type something here..."
            onSave={save}
        />
    )
}

module.exports = Basic;
