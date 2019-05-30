import React from 'react';
import { render } from 'react-dom';
import Graph from './Graph';

let defaultconfig = {
  width: 0,
  height: 500,
  size: 30,
  showLabel: true,
  colorMap: {},
  callback: (model)=>{console.log(model)},
}

function initGraph(el, data, config){
  defaultconfig.colorMap = initcolorMap(data);
  const cfg = {...defaultconfig, ...config};
  console.log(cfg);
  render(<Graph data={data} config={cfg}/>, el);
}

function initcolorMap(data){
  let labels = new Array();
  data.nodes.map((value,index)=>{
    if(!labels.includes(value.label)) labels.push(value.label);
  });
  let colorMap = {};
  labels.map((value,index)=>{colorMap[value]='#'+ Math.random().toString(16).substr(2,6);});
  return colorMap;
}

window.initGraph = function(el, data, config){
  initGraph(el,data,config)
}

export function printTest(){
  console.log("This is a test. Prove that you imported the module correctly!");
}


export default initGraph;