import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import Graph from './Graph';

let labels = ['老师','学生'];

$.ajax({
  type: "POST",
  url: 'http://127.0.0.1:8080/neo4j/select/graph',
  contentType: "application/json;charset=UTF-8",
  data: JSON.stringify(labels),
  success: (data,status)=>{
    render(<Graph data={data} />, document.getElementById('root'));
  },
  error: (msg)=>{
    console.log(msg);
  }
});