import React  from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString';
import { columnizeString, elementWidth, calculateRowLength } from './Utils';

import styles from './Row.scss';

export default class Row extends React.Component {

    getMaxSequenceLength(charWidth, columnWidth) {
        var sequenceWidthPx = elementWidth(this.refs.sequenceContainer);
        return calculateRowLength(charWidth, sequenceWidthPx, columnWidth);
    }

    _resizeSVG() {
        var {
            sequenceContainer: svg
        } = this.refs;

        var bbox = svg.getBBox();
        svg.setAttribute('height', bbox.y + bbox.height + 'px');
    }

    componentDidMount() {
        this._resizeSVG();
    }

    componentDidUpdate() {
        this._resizeSVG();
    }

    _processProps(props) {
        var {
            sequenceData,
            columnWidth,
            selectionLayer
        } = props;

        var {
            sequence,
            offset,
            className,
            charWidth
        } = sequenceData;

        var complement = getComplementSequenceString(sequence);

        var renderedSequence = columnizeString(sequence, columnWidth);
        var renderedComplement = columnizeString(complement, columnWidth);

        var renderedSelectionLayer = {};

        if (selectionLayer) {
            renderedSelectionLayer.start = selectionLayer.start - offset;
            renderedSelectionLayer.end = selectionLayer.end - offset;
        }

        renderedSelectionLayer.toString = function() {
            var x = this.start * charWidth;
            var width = this.end * charWidth;

            return `${x},0 ${x},10, ${width},10 ${width},0`;
        }

        return {
            renderedSequence: renderedSequence,
            renderedComplement: renderedComplement,
            renderedOffset: (offset || 0) + 1,
            renderedSelectionLayer: renderedSelectionLayer
        };
    }

    render() {
        var {
            className,
            sequenceData: { offset, charWidth }
        } = this.props;

        var {
            renderedSequence,
            renderedComplement,
            renderedOffset,
            renderedSelectionLayer
        } = this._processProps(this.props);

        return (
            <div className={styles.rowItem + ' ' + className}>
                <div className={styles.margin}>
                    {renderedOffset}
                </div>

                <svg data-offset={offset} ref={'sequenceContainer'} className={styles.sequenceContainer}>
                    <text ref={'sequence'} className={styles.sequence}>
                        <tspan className={styles.sequence}>
                            {renderedSequence}
                        </tspan>

                        <tspan x={0} dy={'1.2em'} className={styles.sequence + ' ' + styles.reversed}>
                            {renderedComplement}
                        </tspan>
                    </text>

                    <polygon points={renderedSelectionLayer} style={{fill: 'red', stroke: 'blue'}} />
                </svg>
            </div>
        );
    }

}
