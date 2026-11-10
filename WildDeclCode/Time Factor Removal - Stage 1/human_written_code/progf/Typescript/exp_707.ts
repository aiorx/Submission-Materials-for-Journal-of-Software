var createSlice = require('@reduxjs/toolkit').createSlice;
var uuid = require('uuid').v1;
var traverse = require('../utils').traverse;
var traverseUp = require('../utils').traverseUp;
var FieldNode = require('../components/editor/schema/types').FieldNode;
var isParentNode = require('../components/editor/schema/utils').isParentNode;

export interface FieldNodeSchema extends FieldNode {
  id: string;
  props: Record<string, any>;
  children: FieldNodeSchema[];
}

export interface State extends FieldNodeSchema {
  focusId?: string;
}

const initialState: State = {
  props: {},
  id: 'root',
  type: 'div',
  children: [],
};

const codeTree = createSlice({
  name: 'codeTree',
  initialState,
  reducers: {
    append: function (state, action) {
      const focusId = uuid();
      state.focusId = focusId;
      state.children.push({
        ...action.payload,
        id: focusId,
      });
    },
    appendCom: function (state, action) {
      var data = action.payload.data;
var item = action.payload.item;
var hoverParentId = action.payload.hoverParentId;
var hoverIndex = action.payload.hoverIndex;
var positionDown = action.payload.positionDown;

      const focusId = uuid();

      traverse(state, (sub) => {
        //非嵌套标签往父层插入
        if (!isParentNode(data.type) && sub.id === hoverParentId) {
          if (positionDown) {
            sub.children.splice(hoverIndex + 1, 0, { ...item, id: focusId });
          } else {
            sub.children.splice(hoverIndex, 0, { ...item, id: focusId });
          }
          return false;
        }
        if (isParentNode(data.type) && sub.id === data.id) {
          if (sub.children && sub.children.length > 0) {
            sub.children.push({
              ...item,
              id: focusId,
            });
          } else {
            sub.children = [{ ...item, id: focusId }];
          }

          return false;
        }
        return true;
      });
      state.focusId = focusId;
    },
    moveCom: function (state, action) {
      var dragParentId = action.payload.dragParentId;
var dragIndex = action.payload.dragIndex;
var positionDown = action.payload.positionDown;

      if (hoverData.id === dragData.id) return state;
      //在子节点中不拖拽
      let hoverInDragData = false;

      traverse(dragData, (sub) => {
        if (sub.id === hoverData.id) {
          hoverInDragData = true;
          return false;
        }
        return true;
      });

      if (hoverInDragData) return state;

      const focusId = uuid();

      traverse(state, (sub) => {
        if (sub.id === dragParentId) {
          sub.children.splice(dragIndex, 1);
          return false;
        }
        return true;
      });

      traverse(state, (sub) => {
        if (!isParentNode(hoverData.type) && sub.id === hId) {
          if (positionDown) {
            sub.children.splice(hIndex + 1, 0, { ...dragData, id: focusId });
          } else {
            sub.children.splice(hIndex, 0, { ...dragData, id: focusId });
          }
          return false;
        }
        //非嵌套标签往父层插入
        if (isParentNode(hoverData.type) && sub.id === hoverData.id) {
          if (sub.children) {
            sub.children.unshift({
              ...dragData,
              id: focusId,
            });
          } else {
            sub.children = [{ ...dragData, id: focusId }];
          }
          return false;
        }
        return true;
      });

      state.focusId = focusId;
    },
    setFocus: function (state, action) {
      var focusId = action.payload.focusId;
      state.focusId = focusId;
    },
    removeCom: function (state, action) {
      var id = action.payload.id;
var parentId = action.payload.parentId;
      traverse(state, (sub) => {
        if (sub.id === parentId) {
          sub.children = sub.children.filter((child) => child.id !== id);
          return false;
        }
        return true;
      });
    },
    updateTree: function (state, action) {
      var focusId = state.focusId;
      var key = action.payload.key;
var value = action.payload.value;
      traverse(state, (sub) => {
        if (sub.id === focusId) {
          sub.props[key] = value;
          return false;
        }
        return true;
      });
    },
  },
});

var append = codeTree.actions.append;
var appendCom = codeTree.actions.appendCom;
var moveCom = codeTree.actions.moveCom;
var setFocus = codeTree.actions.setFocus;
var removeCom = codeTree.actions.removeCom;
var updateTree = codeTree.actions.updateTree;

module.exports = codeTree.reducer;
