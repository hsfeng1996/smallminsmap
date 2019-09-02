

function colorMapByLabel(nodes) {
    let labels = Array.from(new Set(nodes.map(node => node.label)));

    let colorMap = {};

    labels.map((label, index) => {
        colorMap[label] = '#' + Math.random().toString(16).substr(2, 6);
    });
    return colorMap;
}


export default {
    colorMapByLabel,
};