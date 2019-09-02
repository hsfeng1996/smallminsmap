import React from 'react';
import ForceDirect from "./ForceDirect";
import Util from './Util';

const { colorMapByLabel } = Util;

const defaultconfig = {
    graphType: "force-direct",
    width: 600,
    height: 400,
    size: 30,
    colorMap: {},
    autoFitViw: true,
    callback: null,
}

class GraphView extends React.Component {

    defaultconfig = {};

    componentWillMount() {
        this.defaultconfig = {...defaultconfig, ...this.props.config};
        this.defaultconfig.colorMap = colorMapByLabel(this.props.data.nodes);
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
        let data = this.format(this.props.data);
        let config = {...this.defaultconfig};

        if(config.graphType === "force-direct"){
            return <ForceDirect data={this.format(data)} config={config} />;
        }

        return <ForceDirect data={this.format(data)} config={config} />;
    };


    render() {
        return (
            <div> {this.createGraph()} </div>
        );
    }
}


export default GraphView;