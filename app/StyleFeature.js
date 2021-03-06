import React, { PropTypes } from 'react';

StyleFeature.propTypes = {
    color: PropTypes.string.isRequired,
    signals: PropTypes.shape({
        featureClicked: PropTypes.func.isRequired
    }),
    annotation: PropTypes.object.isRequired,
    children: PropTypes.element
}

export default function StyleFeature({children, color, annotation, signals}) {
    return (
        <g
            onClick={ function (e) {
                e.stopPropagation()
                signals.featureClicked({annotation: annotation}) 
                }
            }
            strokeWidth="1"
            stroke={ color || 'gray'}
            fill={ color || 'gray' }
        >
            { children }
        </g>
    )
}