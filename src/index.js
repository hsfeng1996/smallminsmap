import React from 'react';
import {render} from 'react-dom';
import CommonView from './ModelView/CommonView';

function initGraph(el, data, config) {
  render(<CommonView data={data} config={config}/>, el);
}

window.initGraph = function (el, data, config) {
    initGraph(el, data, config)
}

export function printTest() {
    console.log("This is a test. Prove that you imported the module correctly!");
}

export default initGraph;