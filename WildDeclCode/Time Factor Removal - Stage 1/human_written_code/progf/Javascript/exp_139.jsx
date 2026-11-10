var React = require('react');
var Button = require('antd').Button;
var Tooltip = require('antd').Tooltip;

const Single = function props {
    var selected = props.selected;
var description = props.description;
var content = props.content;
var onClick = props.onClick;const onMouseDown = (event) => {
        event.preventDefault();

        onClick()
    }

    return (
        <Tooltip title={description}>
            <Button
                size="small"
                type={selected ? 'primary' : 'default'}
                onMouseDown={event => onMouseDown(event)}
                style={{ marginLeft: '2px', marginRight: '2px' }}
            >
                {content}
            </Button>
        </Tooltip>
    )
}

module.exports = Single;
