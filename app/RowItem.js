var React = require('react');
var _ = require('lodash');
var classnames = require('classnames');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
var CHAR_HEIGHT = require('./editorConstants').CHAR_HEIGHT;
var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
var ANNOTATION_HEIGHT = require('./editorConstants').ANNOTATION_HEIGHT;
var SPACE_BETWEEN_ANNOTATIONS = require('./editorConstants').SPACE_BETWEEN_ANNOTATIONS;
var mixin = require('baobab-react/mixins').branch;
var get



var RowItem = React.createClass({
  mixins: [mixin],
  cursors: {
    visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
    // sequenceData: ['vectorEditorState', 'sequenceData'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
  },

  getDefaultProps: function() {
    return {
      row: {
        features: {
        }
      },
      showFeatures: true,
      showReverseSequence: true,
      rowLength: 30,
    };
  },
  render: function () {
    var {rowLength, row} = this.props;
    var visibilityParameters = this.state.visibilityParameters;
    var selectionLayer = this.state.selectionLayer;
    var combinedHeightOfChildElements = 0;
    function createFeatureRawPath ({xStart, yStart, height, width, direction, type}) {
      var xEnd = xStart + width;
      var yEnd = yStart  + height;
      var path = "M"+xStart+","+ yStart
                      +" L"+xEnd+","+ yStart
                      +" L"+xEnd+","+ yEnd
                      +" L"+xStart+","+yEnd+" Z";
      return path;
    }

    // function makeAnnotation(xStart, yStart, height, length, direction, strokeColor, fill, id, pathMaker) {
    //   var path = pathMaker(xStart, yStart, height, length, direction, strokeColor);
    // }
    // if (showReverseSequence) {
    //   combinedHeightOfChildElements+= (SPACE_BETWEEN_ANNOTATIONS + ANNOTATION_HEIGHT); //tnrtodo work out these spacing issues
    // }
    if (visibilityParameters.showFeatures) {
      // combinedHeightOfChildElements+= (row.featuresYOffsetMax + 1) * ANNOTATION_HEIGHT + SPACE_BETWEEN_ANNOTATIONS;
      var featuresSVG = createAnnotationPaths({
        annotations: row.features,
        createAnnotationRawPath: createFeatureRawPath,
        annotationHeight: ANNOTATION_HEIGHT,
        spaceBetweenAnnotations: SPACE_BETWEEN_ANNOTATIONS,
        charWidth: CHAR_WIDTH,
        annotationYOffsetMax: row.featuresYOffsetMax,
      });
    }

    if (visibilityParameters.showParts) {
      // combinedHeightOfChildElements+= (row.featuresYOffsetMax + 1) * ANNOTATION_HEIGHT + SPACE_BETWEEN_ANNOTATIONS;
      var partsSVG = createAnnotationPaths({
        annotations: row.parts,
        createAnnotationRawPath: createFeatureRawPath,
        annotationHeight: ANNOTATION_HEIGHT,
        spaceBetweenAnnotations: SPACE_BETWEEN_ANNOTATIONS,
        charWidth: CHAR_WIDTH,
        annotationYOffsetMax: row.featuresYOffsetMax,
      });
    }

    function getXStartAndWidthOfRowAnnotation(range, rowLength, charWidth) {
      return {
        xStart: (range.start % rowLength) * charWidth,
        width: ((range.end - range.start) % rowLength) * charWidth,
      }
    }

    function createAnnotationPaths({annotations, annotationYOffsetMax, createAnnotationRawPath, annotationHeight, spaceBetweenAnnotations, charWidth}) {
      var maxElementHeight = (annotationYOffsetMax + 1) * (annotationHeight + spaceBetweenAnnotations);
      var annotationsSVG = _.map(annotations, function(annotationRow) {
        var overlapPaths = annotationRow.overlaps.map(function(overlap) {
          // console.log(annotationRow);
          var annotation = annotationRow.annotation; 

          var drawingParameters = {
            xStart: (overlap.start % rowLength) * charWidth,
            width: ((overlap.end - overlap.start) % rowLength) * charWidth,
            yStart: annotationRow.yOffset * (annotationHeight + spaceBetweenAnnotations),
            height: annotationHeight,
            type: overlap.type,
            topStrand: annotation.topStrand,
          };
          var path = createAnnotationRawPath(drawingParameters);

          var attributes = {
            classnames: classnames(annotation.id, annotation.type),
            strokeColor: annotation.color, 
            fill: annotation.color,
            path: path,
            fillOpacity: .4, //come back and change this to a passed var
          };
          var annotationPath = createAnnotationPath(attributes);
          return annotationPath;
        });
        return (overlapPaths);

        function createAnnotationPath ({strokeColor, fill, classnames, path, fillOpacity}) {
            return(<path className={classnames} d={path} stroke={strokeColor} fill={fillOpacity} fill={fill}/>);
        };
      });
      return (
        <svg className="annotationContainer" width="100%" height={maxElementHeight} > 
          {annotationsSVG}
        </svg>
        );
    }

    var fontSize = CHAR_WIDTH + "px";
    var textStyle = {
      fontSize: fontSize,
      fontFamily: "'Courier New', Courier, monospace", 
      // transform: "scale(2,1)",
      // width: "100%"
    };
    var highlightLayerStyle = {
      height: "90%",
      // width: "100%",
      background: 'blue',
      position: "absolute",
      top: "0",
      // right: "0",
      fillOpacity: ".3",
      opacity: ".3",
    }
    var rowContainerStyle = {
      overflow: "hidden",
      position: "relative",
      width: "100%",
    }
    var highlightLayerForRow = getHighlightLayerForRow(selectionLayer, row, highlightLayerStyle);

    function getHighlightLayerForRow(selectionLayer, row, rowLength, highlightLayerStyle) {
      var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row);
      var selectionLayers = overlaps.map(function (overlap) {
        var left = overlap.start
        var width = overlap.start
        <div className="selectionLayer" style={highlightLayerStyle}/>
      })
    }

    

    
    // var enclosingTextDivStyle = {
    //   width: "100%"
    // };
    // console.log( (CHAR_WIDTH * (row.sequence.length - 1))); //tnr: -1 because everything else we're drawing is 0-based whereas the length is 1 based
    var textHTML = 
    '<text fontFamily="Courier New, Courier, monospace" x="0" y="10" textLength="'+ (CHAR_WIDTH * (row.sequence.length - 1)) + '" lengthAdjust="spacing">' + row.sequence + '</text>'
    // console.log(row);
    var className = "row" + row.rowNumber;
    return (
      <div className={className}>
        <div className="rowContainer" style={rowContainerStyle}>
            {featuresSVG}
            {partsSVG}
            <svg className="textContainer" width="100%" height={CHAR_WIDTH} dangerouslySetInnerHTML={{__html: textHTML}} />
            {row.rowNumber} //
            {row.start}
            {highlightLayerForRow}
        </div>
      </div>
    );
  }
});


// <div style={textStyle}>
//             {row.sequence}
//           </div>

// <div fontSize={fontSize} fontFamily="'Courier New', Courier, monospace">

// <svg className= "textContainer" width="100%" height={CHAR_HEIGHT}>
//             <text fontSize={fontSize} fontFamily="'Courier New', Courier, monospace" style={{"textLength": 100}} lengthAdjust="spacingAndGlyphs">
//               {row.sequence}
//             </text> 
//           </svg>

module.exports = RowItem;