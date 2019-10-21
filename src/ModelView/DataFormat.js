
const config = {
    width: 400,
    height: 300,
    backgroundColor: null,
    size: 20,
    collideRadius: 30,
    callback: null,
};

function forceFormat(data, config) {
    let nodeMap = {};
    let nodes = data.nodes.map((node, index) => {
        let color = '#' + Math.random().toString(16).substr(2, 6);
        nodeMap[node.id] = color;
        return {
            ...node,
            id: "" + node.id,
            size: config.size,
            color: color,
            label: node.properties.name,
        };
    });
    let edges = data.edges.map((edge, index) => {
        return {
            id: "" + edge.id,
            source: "" + edge.sourceNode.id,
            target: "" + edge.targetNode.id,
            properties: edge.properties,
            color: nodeMap[edge.sourceNode.id],
        };
    });
    
    return { nodes: nodes, edges: edges };
}

const DataFormat = {
    config: config,
    forceFormat: forceFormat,
};

export default DataFormat;