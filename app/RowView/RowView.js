import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';
import { Decorator as Cerebral } from 'cerebral-view-react';

import styles from './RowView.scss';

import assign from 'lodash/object/assign';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import Row from './Row.js';

@Cerebral()
@propTypes({
    embedded: PropTypes.bool.isRequired,
    sequenceData: PropTypes.object.isRequired,
    columnWidth: PropTypes.number
})
export default class RowView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            dragging: false
        };
    }

    _measures() {
        var {
            columnWidth
        } = this.props;

        var {
            fontMeasure,
            rowMeasure
        } = this.refs;

        var charWidth = fontMeasure.getBoundingClientRect().width;
        var rowLength = rowMeasure.getMaxSequenceLength(charWidth, columnWidth);

        return {charWidth, rowLength};
    }

    _populateRows() {
        var {
            sequenceData,
        } = this.props;

        var {
            sequence,
            size
        } = sequenceData;

        if (size <= 0) return;

        var {charWidth, rowLength} = this._measures();

        if (rowLength === 0) return;

        var rowData = [];

        for (let i = 0; i < size; i += rowLength) {
            let data = {};
            data.sequence = sequence.substr(i, rowLength);
            data.offset = i;
            data = assign({}, sequenceData, data);
            rowData.push(data);
        }

        this.setState({ rowData: rowData });
    }

    componentDidMount() {
        new ResizeSensor(this.refs.rowView, this._populateRows.bind(this));
        this._populateRows();
    }

    _getBpNearestClick(event) {
        var columnWidth = this.props.columnWidth;
        var {charWidth, rowLength} = this._measures();
        var target = event.target;
        var currentEl = target
        var nearestBP = null;

        while(isNaN(parseInt(currentEl.getAttribute('data-offset'))) && currentEl.parentElement) {
            currentEl = currentEl.parentElement;
        }

        var offset = parseInt(currentEl.getAttribute('data-offset'));
        var clickX = event.pageX;
        console.log('cx ', clickX);
        var elX = target.getBoundingClientRect().left;
        elX = Math.floor(elX + 0.5);
        console.log('ex ', elX);
        var localX = clickX - elX;
        console.log('lx ', localX);
        var localBP = Math.floor(localX / charWidth + 0.5);
        localBP = localBP - Math.floor(localBP / columnWidth)
        console.log('lbp ', localBP);

        return offset + localBP;
    }

    _startDrag(event) {
        var {
            signals: {editorDragStarted}
        } = this.props;

        var nearestBP = this._getBpNearestClick(event);

        if (nearestBP !== null) {
            editorDragStarted({nearestBP, caretGrabbed: false});

            this.setState({dragging: true});
        }
    }

    _drag(event) {
        if (!this.state.dragging) return;

        var {
            signals: {editorDragged}
        } = this.props;

        var nearestBP = this._getBpNearestClick(event);

        if (nearestBP !== null) {
            editorDragged({nearestBP, caretGrabbed: false});
        }
    }

    _stopDrag(event) {
        var {
            signals: {editorDragStopped}
        } = this.props;

        editorDragStopped();
        this.setState({dragging: false});
    }

    render() {
        var {
            columnWidth
        } = this.props;

        var {
            embedded,
            rowData
        } = this.state;

        return (
            <div ref={'rowView'}
                 className={styles.rowView}
                 style={ embedded ? { display: 'none' } : null } // prime this inline for embedded version
                 onMouseDown={this._startDrag.bind(this)}
                 onMouseMove={this._drag.bind(this)}
                 onMouseUp={this._stopDrag.bind(this)}
            >
                <div ref={'fontMeasure'} className={styles.fontMeasure}>m</div>
                <Row ref={'rowMeasure'} sequenceData={{ sequence: '' }} className={styles.rowMeasure} />
                {
                    rowData.map(datum => <Row sequenceData={datum} columnWidth={columnWidth} />)
                }
            </div>
        );
    }

}
