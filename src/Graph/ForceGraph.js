import React from 'react';
import G6 from '@antv/g6';
import Plugins from '@antv/g6/plugins';
import * as d3 from 'd3';

class ForceGraph extends React.Component{
	constructor(props){
		super(props);
    this.state = {
    };
	}
	
	componentDidMount(){
    let { data } = this.props;
    this.draw(data);
    window.addEventListener('resize',this.handleResize);
	}
	
	handleResize = () => {
		this.graph.setFitView('cc');
	}
	
	draw = (data) => {
    const { config } = this.props;
    const { height, colorMap, showLabel, callback } = config;
    
    let colors = Object.keys(colorMap).map(key=>colorMap[key]);
    
		var Mapper = G6.Plugins['tool.d3.mapper'];
		var _d = d3,
		  forceSimulation = _d.forceSimulation,
		  forceLink = _d.forceLink,
		  forceManyBody = _d.forceManyBody,
		  forceX = _d.forceX,
		  forceY = _d.forceY,
		  forceCollide = _d.forceCollide;

		//var nodeMap = {};
		var nodeSizeMapper = new Mapper('node', 'degree', 'size', [10, 48], {legendCfg: null});
		var nodeColorMapper = new Mapper('node', 'type', 'color', colors,{legendCfg:null});
		//var G = G6.G;
		var simulation = void 0;
		var graph = new G6.Graph({
		  container: 'mountNode',
		  height: height,
		  plugins: [],//nodeSizeMapper, nodeColorMapper],
		  modes: {default: ['rightPanCanvas','wheelZoom']
		  },
		  layout: function layout(nodes, edges) {
        if (simulation) {
          simulation.alphaTarget(0.3).restart();
        } else {
          simulation = forceSimulation(nodes).force('charge', forceManyBody().strength(-500)).force('link', forceLink(edges).id(function(model) {
            return model.id;
          })).force('collision', forceCollide().radius(function(model) {
            return model.size / 2 * 1.2;
          })).force('y', forceY()).force('x', forceX()).on('tick', function() {
            graph.updateNodePosition();
          });
        }
		  }
		});
		this.graph = graph;
		graph.node({
		  style: function style(model) {
        return {
          fill: colorMap[model.type],//'#002a67',
          shadowColor: 'rgba(0,0,0, 0.3)',
          shadowBlur: 3,
          shadowOffsetX: 3,
          shadowOffsetY: 5,
          stroke: null
        };
		  },
		  label: function label(model) {
        return {
          text: model.properties['name'],
          stroke: null,
          fill: '#000'
        };
		  }
		});
		graph.edge({
		  style: function style() {
        return {
          stroke: '#b3b3b3',
          lineWidth: 2
        };
		  },
		  label: function label(model) {
        return {
          text: model.properties['name'],
        };
		  },
		  labelRectStyle: { opacity: 0 },
		  
		});
		graph.read(data);
		graph.translate(graph.getWidth() / 2, graph.getHeight() / 2);
		
		// 拖拽节点交互
		var subject = void 0; // 逼近点
		graph.on('mousedown', function(ev) {
      if(ev.item){
        subject = ev.item.getModel();
      }
		});

		graph.on('dragstart', function(ev) {
		  subject && simulation.alphaTarget(0.3).restart();
		});

		graph.on('drag', function(ev) {
		  if (subject) {
        subject.fx = ev.x;
        subject.fy = ev.y;
		  }
		});

		graph.on('mouseup', resetState);
		graph.on('canvas:mouseleave', resetState);

		function resetState() {
		  if (subject) {
        simulation.alphaTarget(0);
        subject.fx = null;
        subject.fy = null;
        subject = null;
		  }
		}
		
		// 鼠标移入节点显示 label
		function tryHideLabel(node) {
		  var model = node.getModel();
		  var label = node.getLabel();
		  var labelBox = label.getBBox();
		  if (labelBox.maxX - labelBox.minX > model.size) {
        label.hide();
        console.log(label);
        graph.draw();
		  }
		}
		var nodes = graph.getNodes();
		var edges = graph.getEdges();
		
		edges.forEach(function(edge) {
		  edge.getGraphicGroup().set('capture', false); // 移除边的捕获，提升图形拾取效率
		  tryHideLabel(edge);
		});  

		nodes.forEach(function(node) {
      showLabel||tryHideLabel(node);
		});

		graph.on('node:mouseenter', function(ev) {
		  var item = ev.item;
		  graph.toFront(item);
		  item.getLabel().show();
		  graph.draw();
		});

		graph.on('node:mouseleave', function(ev) {
		  var item = ev.item;
		  showLabel||tryHideLabel(item);
		});
    
    graph.on('node:click',(ev)=>{
      callback(ev.item.getModel());
    });
	}
	
	render() {
		return (
      <div id="mountNode" style={{backgroundColor:'#e5ddd1'}}></div>
		);
	}
}

export default ForceGraph;