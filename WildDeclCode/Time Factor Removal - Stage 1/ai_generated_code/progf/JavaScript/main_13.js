// utility
/**
 * Sets the disabled state of a button with the given ID. If the button is not
 * yet in the DOM, it observes the DOM for changes and sets the disabled state
 * once the button is available.
 *
 * This function was Produced with third-party coding tools's ChatGPT (https://chatgpt.com/)
 */
function setButtonDisabled(buttonId, isDisabled) {
  var observer = new MutationObserver(function (mutations, obs) {
    var button = document.getElementById(buttonId);
    if (button) {
      button.disabled = isDisabled;
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  var button = document.getElementById(buttonId);
  if (button) {
    button.disabled = isDisabled;
    observer.disconnect();
  }
}
window.setButtonDisabled = setButtonDisabled;

function getCssVariable(variable) {
  return getComputedStyle(document.body).getPropertyValue(variable).trim();
}

// vis network
var initNodes = [
  // { id: 1, label: "abc" },
];
var initEdges = [];

var container = document.getElementById("graph-container");
var data = {
  nodes: new vis.DataSet(initNodes),
  edges: new vis.DataSet(initEdges),
};

var options = function () { return ({
  layout: { randomSeed: 2 },
  nodes: {
    labelHighlightBold: false,
    borderWidth: 1,
    borderWidthSelected: 1,
    font: {
      face: getCssVariable("--bulma-body-family"),
      multi: "md",
    },
  },
  edges: {
    arrows: "to",
    arrowStrikethrough: false,
  },
  interaction: {
    selectable: false,
    selectConnectedEdges: false,
    hoverConnectedEdges: false,
  },
}); };
var network = new vis.Network(container, data, options());

// "Vibrant qualitative color-blind safe color scheme" by Paul Tol
// source: https://personal.sron.nl/~pault/#sec:qualitative
var colors = [
  "#EE7733",
  "#0077BB",
  "#EE3377",
  "#009988",
  "#CC3311",
  "#33BBEE",
];

// removes, updates, and adds nodes and edges to the network
function updateNetwork(networkDTO) {
  var view = networkDTO.view;
  var nodes = networkDTO.nodes;
  var edges = networkDTO.edges;
  var oldNodeIds = data.nodes.map(function (item) { return item.id; });
  var oldEdgeIds = data.edges.map(function (item) { return item.id; });
  var newNodeIds = nodes.map(function (item) { return item.id; });
  var newEdgeIds = edges.map(function (item) { return item.id; });
  var removedNodeIds = [];
  var removedEdgeIds = [];

  oldNodeIds.forEach(function (id) {
    if (!newNodeIds.includes(id)) {
      removedNodeIds.push(id);
    }
  });

  oldEdgeIds.forEach(function (id) {
    if (!newEdgeIds.includes(id)) {
      removedEdgeIds.push(id);
    }
  });
  data.edges.remove(removedEdgeIds);
  data.nodes.remove(removedNodeIds);

  nodes.forEach(function (node) {
    var borderWidth = 1;
    var backgroundColor = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "#14161A"
      : "#FFFFFF";
    var fontColor = getCssVariable("--bulma-text-bold");
    var borderDashes = false;
    var borderColor = fontColor;
    var label = node.label;
    var shape = "box";

    if (node.isVinit) {
      borderWidth = 3;
    }

    if (node.isSubject) {
      backgroundColor = getCssVariable("--bulma-primary");
      fontColor = "#14161A";
    }

    if (node.isFactor) {
      backgroundColor = getCssVariable("--bulma-primary");
      fontColor = "#14161A";
      borderDashes = [5, 5];
    }

    if (node.isInitiallyCompromised) {
      borderColor = getCssVariable("--bulma-danger-on-scheme");
      borderWidth = 3;
    }

    if (node.isTransitivelyCompromised) {
      borderColor = getCssVariable("--bulma-danger-on-scheme");
      borderWidth = 3;
      borderDashes = [5, 5];
    }

    if (node.component_ != "") {
      label += "\n_" + node.component_ +"_";
    }

    if (node.hasBackdoor && view == "AnalysisAutomated") {
      label += "\n⚠️"
    }

    data.nodes.update({
      id: node.id,
      label: label,
      physics: networkDTO.physics,
      borderWidth: borderWidth,
      borderWidthSelected: borderWidth,
      color: {
        border: borderColor,
        background: backgroundColor,

        highlight: {
          border: borderColor,
          background: backgroundColor,
        },
      },
      shape: shape,
      shapeProperties: {
        borderDashes: borderDashes,
      },

      font: {
        color: fontColor,
      },
    });

    edges.forEach((edge) => {
      var dashes = false;
      var physics = true;
      var color = colors[edge.colorIndex % colors.length];
      var width = 1;
      var label = " ";
      var opacity = 1.0;

      if (networkDTO.edgeLabels) {
        label = edge.label;
      }

      if (edge.colorIndex == 255) {
        color = getCssVariable("--bulma-text-bold");
      }

      if (edge.isProvisional) {
        dashes = true;
        width = 2;
      }

      if (edge.isHighlighted) {
        width = 3;
      }

      if (edge.isDisabled) {
        opacity = 0.2
      }

      data.edges.update({
        id: edge.id,
        from: edge.from,
        to: edge.to,
        label: label,
        dashes: dashes,
        physics: physics,
        smooth: !edge.straight,
        color: {
          color: color,
          opacity: opacity,
        },
        width: width,
      });
    });
  });
}
window.updateNetwork = updateNetwork;

// unselect dragged node after dragging
network.on("dragEnd", function () {
  network.unselectAll();
});

// custom behavior for clicking on nodes/edges
network.on("click", function (params) {
  // click on node behavior
  var nodeId = this.getNodeAt(params.pointer.DOM);
  var edgeId = this.getEdgeAt(params.pointer.DOM);

  var clickedVertexInput = document.getElementById("ClickedVertexInput");
  var clickedEdgeInput = document.getElementById("ClickedEdgeInput");
  var clickedBackgroundButton = document.getElementById(
    "ClickedBackgroundButton"
  );

  if (nodeId == null && edgeId == null) {
    clickedBackgroundButton.dispatchEvent(
      new Event("click", { bubbles: true })
    );
  } else if (nodeId != null) {
    clickedVertexInput.value = nodeId;
    clickedVertexInput.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    clickedEdgeInput.value = edgeId;
    clickedEdgeInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
});

// Listen for changes in the system's color scheme preference
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", function (e) {
    network.setOptions(options());
    updateNetwork({
      nodes: data.nodes.get(),
      edges: data.edges.get(),
    });
  });
