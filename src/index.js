import React from 'react';
import {render} from 'react-dom';
import GraphView from './ModelView/GraphView';
import Util from './ModelView/Util';

const { colorMapByLabel } = Util;

/*let defaultconfig = {
    width: 600,
    height: 400,
    backgroundColor: null,
    size: 30,
    showLabel: true,
    colorMap: {},
    callback: null,
}*/

function initGraph(el, data, config) {
  // defaultconfig.colorMap = colorMapByLabel(data.nodes);
  render(<GraphView data={data} config={config}/>, el);
}

window.initGraph = function (el, data, config) {
    initGraph(el, data, config)
}

export function printTest() {
    console.log("This is a test. Prove that you imported the module correctly!");
}

export default initGraph;