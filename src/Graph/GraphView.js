import React from 'react';
import ForceDirect from "./ForceDirect";

class Force extends React.Component {
    defaultconfig = {
        width: 500,
        height: 500,
        backgroundColor: null,
        size: 30,
        showLabel: true,
        colorMap: {},
        callback: null,
    }

    random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    format = (data) => {
        let nodes = data.nodes.map((value, index) => {
            return {
                ...value,
                id: "" + value.id,
                size: this.defaultconfig.size,
                name: value.properties.name,
                color: '#' + Math.random().toString(16).substr(2, 6), // colorMap[value.label],
                // label: null,
                label: value.properties.name,
            };
        });
        let edges = data.edges.map((value, index) => {
            return {
                ...value,
                id: "" + value.id,
                name: value.properties.name,
                // label: value.type,
                source: "" + value.sourceNode.id,
                target: "" + value.targetNode.id,
            };
        });
        return {nodes: nodes, edges: edges};
    }

    createGraph = () => {
        const {data, config} = this.props;
        return <ForceDirect data={this.format(data)}/>;
    };


    render() {
        return (
            <div> {this.createGraph()} </div>
        );
    }
}


export default Force;