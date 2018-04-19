import React from "react";
import Draggable from "react-draggable";
import Axis from "../RowItem/Axis";
import getXStartAndWidthFromNonCircularRange from "../RowItem/getXStartAndWidthFromNonCircularRange";
import { view } from "react-easy-state";

export default class Minimap extends React.Component {
  onDrag = e => {
    const { onMinimapScroll, dimensions: { width = 200 } } = this.props;
    const scrollHandleWidth = this.getScrollHandleWidth();
    const percent =
      this.getXPositionOfClickInMinimap(e) / (width - scrollHandleWidth);
    onMinimapScroll(percent);
  };

  handleMinimapClick = e => {
    const { onMinimapScroll, dimensions: { width = 200 } } = this.props;
    const scrollHandleWidth = this.getScrollHandleWidth();

    const percent =
      this.getXPositionOfClickInMinimap(e) / (width - scrollHandleWidth);
    onMinimapScroll(percent);
  };
  getXPositionOfClickInMinimap = e => {
    const leftStart = this.minimap.getBoundingClientRect().left;
    return Math.max(e.clientX - leftStart, 0);
  };

  getCharWidth = () => {
    const { alignmentTracks = [], dimensions: { width = 200 } } = this.props;
    const [template] = alignmentTracks;
    const seqLength = template.alignmentData.sequence.length;
    const charWidth = Math.min(16, width / seqLength);
    return charWidth || 12;
  };
  getScrollHandleWidth = () => {
    const { numBpsShownInLinearView, dimensions } = this.props;
    const charWidth = this.getCharWidth();
    const { width } = getXStartAndWidthFromNonCircularRange(
      { start: 0, end: Math.max(numBpsShownInLinearView - 1, 0) },
      charWidth
    );
    return Math.min(width, dimensions.width);
  };

  render() {
    const {
      alignmentTracks = [],
      dimensions: { width = 200 },
      style = {},
      laneHeight = 17,
      laneSpacing = 3,
      easyStore
    } = this.props;
    const [template /* ...nonTemplates */] = alignmentTracks;
    const seqLength = template.alignmentData.sequence.length;
    const charWidth = this.getCharWidth();
    const scrollHandleWidth = this.getScrollHandleWidth();

    return (
      <div
        ref={ref => (this.minimap = ref)}
        className={"alignmentMinimap"}
        style={{ position: "relative", width, ...style }}
        onClick={this.handleMinimapClick}
      >
        <YellowScrollHandle
          width={width}
          easyStore={easyStore} //we use react-easy-state here to prevent costly setStates from being called
          scrollHandleWidth={scrollHandleWidth}
          onDrag={this.onDrag}
        />
        <div style={{ maxHeight: 150, overflowY: "auto" }}>
          <svg height={alignmentTracks.length * laneHeight} width={width}>
            {alignmentTracks.map(({ matchHighlightRanges }, i) => {
              //need to get the chunks that can be rendered
              return matchHighlightRanges.map((range, index) => {
                const { xStart, width } = getXStartAndWidthFromNonCircularRange(
                  range,
                  charWidth
                );
                return (
                  <rect
                    key={i + "-" + index}
                    y={laneHeight * i}
                    height={laneHeight - laneSpacing}
                    fill={range.isMatch ? "grey" : "red"}
                    {...{ x: xStart, width }}
                  />
                );
              });
            })}
          </svg>
        </div>

        <Axis
          {...{
            row: { start: 0, end: seqLength },
            tickSpacing: Math.floor(seqLength / 10),
            bpsPerRow: seqLength,
            charWidth,
            annotationHeight: 15,
            sequenceLength: seqLength
          }}
        />
      </div>
    );
  }
}

const YellowScrollHandle = view(function YellowScrollHandleInner({
  scrollHandleWidth,
  width,
  easyStore,
  onDrag
}) {
  const xScroll = easyStore.percentScrolled * (width - scrollHandleWidth);
  return (
    <Draggable
      bounds={"parent"}
      zIndex={105}
      position={{ x: xScroll, y: 0 }}
      axis={"x"}
      onDrag={onDrag}
    >
      <div
        className={"syncscroll"}
        dataName="scrollGroup"
        style={{
          height: "100%",
          border: "none",
          cursor: "move",
          opacity: ".3",
          top: "0px",
          position: "absolute",
          zIndex: "10",
          width: scrollHandleWidth,
          background: "yellow"
        }}
      />
    </Draggable>
  );
});
