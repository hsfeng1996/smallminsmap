
const config = {
    width: 400,
    height: 300,
    backgroundColor: null,
    size: 20,
    collideRadius: 30,
    callback: null,
    zoomSize: 100,
};

function forceFormat(data, config) {
    let nodeMap = {};
    let nodes = data.nodes.map((n, index) => {
        let color = '#' + Math.random().toString(16).substr(2, 6);
        let node = {...n};
        node.id = node.uuid;
        node.groupId = null;
        node.size = node.size || config.size;
        node.label = node.name || node.properties.name;
        node.color = node.color || color;
        nodeMap[node.uuid] = node;
        return node;
    });
    let edges = data.edges.map((edge, index) => {
        return {
            // ...edge,
            id: edge.uuid,
            source: edge.sourceNode.uuid,
            target: edge.targetNode.uuid,
            properties: edge.properties,
            color: nodeMap[edge.sourceNode.uuid].color,
        };
    });
    
    return { nodes: nodes, edges: edges };
}

const DataFormat = {
    config: config,
    forceFormat: forceFormat,
};

export default DataFormat;
