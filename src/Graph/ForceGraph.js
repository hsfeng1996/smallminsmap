import React from 'react';
import G6 from '@antv/g6';
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
    //window.addEventListener('resize',this.handleResize);
	}
	
	handleResize = () => {
		//this.graph.setFitView('cc');
	}
	
	draw = (data) => {
    const { config } = this.props;
    const { width, height, callback } = config;
    var graph = new G6.Graph({
      container: 'mountNode',
      width: width,
      height: height,
      autoPaint: false,
      modes: {
        default: ['drag-canvas', {
          type: 'zoom-canvas',
          sensitivity: 5
          /*
          type: 'tooltip',
          formatText: function formatText(model) {
            return model.properties.name;
          }
          */
        }, {
            type: 'edge-tooltip',
            formatText: function formatText(model, e) {
              var edge = e.item;
              return '来源：' + edge.getSource().getModel().properties.name + '<br/>去向：' + edge.getTarget().getModel().properties.name;
            }
        }]
      },
      defaultNode: {
        size: [10, 10],
        color: 'steelblue',
        labelCfg: {
          position: 'right',
        },
      },
      defaultEdge: {
        size: 1
      },
      nodeStyle: {
        default: {
          lineWidth: 2,
          fill: 'steelblue'
        },
        highlight: {
          opacity: 1
        },
        dark: {
          opacity: 0.2
        }
      },
      edgeStyle: {
        default: {
          stroke: '#e2e2e2',
          lineAppendWidth: 2
        },
        highlight: {
          stroke: '#000000'
        }
      }
    });

    function clearAllStats() {
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function(node) {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach(function(edge) {
        graph.clearItemStates(edge);
      });
      graph.paint();
      graph.setAutoPaint(true);
    }
    graph.on('node:mouseenter', function(e) {
      var item = e.item;
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function(node) {
        graph.clearItemStates(node);
        graph.setItemState(node, 'dark', true);
      });
      graph.setItemState(item, 'dark', false);
      graph.setItemState(item, 'highlight', true);
      graph.getEdges().forEach(function(edge) {
        if (edge.getSource() === item) {
          graph.setItemState(edge.getTarget(), 'dark', false);
          graph.setItemState(edge.getTarget(), 'highlight', true);
          graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        } else if (edge.getTarget() === item) {
          graph.setItemState(edge.getSource(), 'dark', false);
          graph.setItemState(edge.getSource(), 'highlight', true);
          graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        } else {
          graph.setItemState(edge, 'highlight', false);
        }
      });
      graph.paint();
      graph.setAutoPaint(true);
    });
    graph.on('node:mouseleave', function(e){
      clearAllStats();
    });
    //graph.on('canvas:click', clearAllStats);
    graph.on('node:click', function(e){
      clearAllStats();
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function(node) {
        graph.update(node,{size:30});
      });
      graph.update(e.item,{size:35});
      graph.paint();
      graph.setAutoPaint(true);
      if(callback) callback(e.item.getModel());
    });
    
    graph.data({
      nodes: data.nodes,
      edges: data.edges.map(function(edge, i) {
        edge.id = 'edge' + i;
        return Object.assign({}, edge);
      })
    });
    var simulation = d3.forceSimulation().force("link", d3.forceLink().id(function(d) {
      return d.id;
    }).strength(0.5)).force("charge", d3.forceManyBody().strength(-200)).force("center", d3.forceCenter(width/2, height/2));
    simulation.nodes(data.nodes).on("tick", ticked);
    simulation.force("link").links(data.edges);

    graph.render();

    function ticked() {
      graph.refreshPositions();
      graph.paint();
    }
	}
	
	render() {
		return (
      <div id="mountNode"></div>
		);
	}
}

export default ForceGraph;