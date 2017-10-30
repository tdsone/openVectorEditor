import React from "react";
import withEditorProps from "../withEditorProps";
import downloadTool from "./downloadTool";
import cutsiteTool from "./cutsiteTool";
import featureTool from "./featureTool";
import oligoTool from "./oligoTool";
import orfTool from "./orfTool";
import viewTool from "./viewTool";
import editTool from "./editTool";
import findTool from "./findTool";
import saveTool from "./saveTool";
import visibilityTool from "./visibilityTool";
import propertiesTool from "./propertiesTool";

import ToolbarItem from "./ToolbarItem";
import undoTool from "./undoTool";
import redoTool from "./redoTool";

// import get from 'lodash/get'
import "./style.css";

export class VeToolBar extends React.Component {
  state = {
    openItem: -1
  };

  toggleOpen = index => {
    if (this.state.openItem === index) {
      this.setState({
        openItem: -1
      });
    } else {
      this.setState({
        openItem: index
      });
    }
  };

  render() {
    const {
      AdditionalTools = [],
      modifyTools,
      excludeObj = {},
      ...rest
    } = this.props;

    let items = [
      saveTool,
      downloadTool,
      undoTool,
      redoTool,
      cutsiteTool,
      featureTool,
      oligoTool,
      orfTool,
      viewTool,
      editTool,
      findTool,
      visibilityTool,
      propertiesTool,
      ...AdditionalTools
    ];

    if (modifyTools) {
      items = modifyTools(items);
    }

    items = items.filter(function(item) {
      if (excludeObj[item.id]) {
        return false;
      } else {
        return true;
      }
    });
    // let content = items.map((item, index) => <ToolbarItem key={item.id} {...{item, toggleOpen: this.toggleOpen, isOpen: index === this.state.openItem, index, ...rest}}></ToolbarItem>);
    let content = items.map((item, index) => (
      <ToolbarItem
        key={index}
        {...{
          item,
          toggleOpen: this.toggleOpen,
          isOpen: index === this.state.openItem,
          index,
          ...rest
        }}
      />
    ));

    return <div className={"veToolbar"}>{content}</div>;
  }
}

export default withEditorProps(VeToolBar);