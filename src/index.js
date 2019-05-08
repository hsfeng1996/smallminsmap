import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import Graph from './Graph';

let labels = ['老师','学生','_SCHEMA'];

$.ajax({
  type: "POST",
  url: '/neo4j/select/graph',
  contentType: "application/json;charset=UTF-8",
  data: JSON.stringify(labels),
  success: (data,status)=>{
    console.log(data);
    render(<Graph data={data} />, document.getElementById('root'));
  },
  error: (msg)=>{
    console.log(msg);
  }
});