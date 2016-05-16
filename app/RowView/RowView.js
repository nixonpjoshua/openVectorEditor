import React, { PropTypes } from 'react';
import { propTypes } from '../react-props-decorators.js';

import styles from './RowView.scss';

import assign from 'lodash/object/assign';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import Row from './Row.js';

@propTypes({
    embedded: PropTypes.bool.isRequired,
    sequenceData: PropTypes.object.isRequired,
    columnWidth: PropTypes.number
})
export default class RowView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            rowData: []
        };
    }

    _populateRows() {
        var {
            sequenceData,
            columnWidth
        } = this.props;

        var {
            fontMeasure,
            rowMeasure
        } = this.refs;

        var {
            sequence,
            size
        } = sequenceData;

        if (size <= 0) return;

        var charWidth = fontMeasure.getBoundingClientRect().width;
        var rowLength = rowMeasure.getMaxSequenceLength(charWidth, columnWidth);

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
                className={ styles.rowView }
                style={ embedded ? { display: 'none' } : null } // prime this inline for embedded version
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
