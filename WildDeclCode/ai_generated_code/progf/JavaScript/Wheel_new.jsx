import React from "react";
import "./index.css";
import PropTypes from "prop-types";

export default class Wheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      items: [],
      showModal: false,
    };
    this.selectItem = this.selectItem.bind(this);
    this.checkEmployeeId = this.checkEmployeeId.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:5001/projects")
      .then(response => response.json())
      .then(data => {
        this.setState({ items: data });
      })
      .catch(error => {
        console.error("Error fetching items:", error);
      });

    this.checkEmployeeId(this.props.employeeId); // Check employee ID on mount
  }

  checkEmployeeId(employeeId) {
    const approvedEmployeeIds = ["123", "456", "789"]; // Replace with actual approved employee IDs
    if (!approvedEmployeeIds.includes(employeeId)) {
      this.setState({ showModal: true });
    }
  }

  selectItem() {
    if (this.state.items.length === 0 || this.props.spinning === true) {
      console.log("Cant spin empty wheel");
      return;
    }
    if (this.state.selectedItem === null) {
      const selectedItem = Math.floor(Math.random() * this.state.items.length);
      this.props.onChange(selectedItem);
      if (this.props.onSelectItem) {
        this.props.onSelectItem(selectedItem);
      }
      this.setState({ selectedItem });
    } else {
      this.setState({ selectedItem: null });
      setTimeout(this.selectItem, 500);
    }
  }

  render() {
    const { selectedItem, items, showModal } = this.state;

    const wheelVars = {
      "--nb-item": items.length,
      "--selected-item": selectedItem,
    };
    const spinning = selectedItem !== null ? "spinning" : "";

    let spinDuration = localStorage.getItem("duration");

    let cssProperties = {};

    cssProperties["--spinning-duration"] = `${spinDuration}s`;
    cssProperties["--wheel-color"] = `${this.props.wheelColor}`;
    cssProperties["--neutral-color"] = `${this.props.fontColor}`;

    if (cssProperties["--wheel-color"] === "null")
      cssProperties["--wheel-color"] = "#d38c12";

    if (cssProperties["--neutral-color"] === "null")
      cssProperties["--neutral-color"] = "#FFFFFF";

    return (
      <div style={cssProperties}>
        {showModal && (
          <div className="modal">
            <p>Employee is not entitled</p>
          </div>
        )}
        <div className="wheel-container" style={{ opacity: showModal ? 0.7 : 1 }}>
          <div
            lg={true}
            className={`wheel ${spinning}`}
            style={wheelVars}
            onClick={this.selectItem}
          >
            {items.map((item, index) => (
              <div
                className="wheel-item"
                key={index}
                style={{ "--item-nb": index }}
              >
                {index % 4 === 0 && 'Spin the wheel'}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// Define prop types
Wheel.propTypes = { 
  onChange: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func,
  spinning: PropTypes.bool,
  wheelColor: PropTypes.string,
  fontColor: PropTypes.string,
  employeeId: PropTypes.string.isRequired, // Add employeeId prop type
};

// Define default prop values
Wheel.defaultProps = {
  onChange: () => {},
  spinning: false,
  wheelColor: "#d38c12",
  fontColor: "#FFFFFF",
};

// Supported via standard GitHub programming aids
