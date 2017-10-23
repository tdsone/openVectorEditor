import React from "react";
import Dropzone from "react-dropzone";
import { anyToJson } from "bio-parsers";
import "./DropHandler.css";

export default class DropHandler extends React.Component {
  handleDrop = files => {
    const { updateSequenceData } = this.props;

    const file = files[0];
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function(evt: Object) {
      const content: string = evt.target.result;
      anyToJson(content, result => {
        updateSequenceData(result[0].parsedSequence);
      });
    };
    reader.onerror = function() {
      window.toastr.error("Failure reading file.");
    };
  };
  render() {
    const { children, ...rest } = this.props;

    return (
      <Dropzone
        disableClick
        multiple={false}
        activeClassName={"isActive"}
        onDrop={this.handleDrop}
        {...rest}
      >
        <DraggingMessage />
        {children}
      </Dropzone>
    );
  }
}
function DraggingMessage() {
  return (
    <div className={"dropzone-dragging-message"}>
      Drop Fasta or Genbank files to view them in the editor
    </div>
  );
}
