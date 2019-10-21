import React, { useState, useEffect, useRef } from 'react';
import UUID from "uuid-js";
import G6 from '@antv/g6';
import * as d3 from 'd3';

function ForceDirect(props) {
    
    const divRef = useRef(null);
    const [state, setState] = useState({
        divId: UUID.create().toString(),
        Graph: null,
    });
    
    useEffect(() => {
        if(props.data.nodes && props.data.nodes.length !== 0){
            if(state.Graph){
                state.Graph.changeData({
                    nodes: props.data.nodes,
                    edges: props.data.edges.map(function(edge, i) {
                        edge.id = 'edge' + i;
                        return Object.assign({}, edge);
                    }),
                });
                simulate(props.data);
            }else{
                //divRef.current.innerHTML = '';
                initGraph();
                draw(props.data);
            }
        }
    }, [props.data]);
    
    let initGraph = () => {
        G6.registerNode('textShape', {
            draw(cfg, group) {
                const circle = group.addShape('circle', {
                    attrs: {
                        x: 0,
                        y: 0,
                        r: cfg.size/2,
                        fill: cfg.color
                    }
                });
                const text = group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: -10,
                        textAlign: 'center',
                        fontSize: 10,
                        text: cfg.label,
                        fill: '#444'
                    }
                });
                return circle;
            }
        });
        
        let { config } = props;
        let width = config.width ? config.width : divRef.current.offsetWidth;
        let height = config.height ? config.height : divRef.current.offsetWidth * 9 / 16;
        
        let graph = new G6.Graph({
            container: state.divId,
            width: width,
            height: height,
            autoPaint: false,
            modes: {
                default: ['drag-canvas', {
                    type: 'zoom-canvas',
                    sensitivity: 5,
                    /*type: 'tooltip',
                    formatText: function formatText(model) {
                        return model.text ? (model.name + ':<br/>' + model.text) : model.name;
                    },*/
                },/* {
                    type: 'edge-tooltip',
                    formatText: function formatText(model, e) {
                        var edge = e.item;
                        // return '来源：' + edge.getSource().getModel().name + '<br/>去向：' + edge.getTarget().getModel().name;
                        return (
                            "<span style='font-weight: bold'>" +
                            edge.getSource().getModel().name + '-' + edge.getModel().name + '->' + edge.getTarget().getModel().name +
                            "</span>"
                        );
                    },
                }*/],
            },
            /*layout: {                // Object，可选，布局的方法及其配置项，默认为 random 布局。
                type: 'force',
                preventOverlap: true,
                nodeSize: 20,
                nodeStrength: -30,
                edgeStrength: 5,
                linkDistance: 100,
            },*/
            /*defaultNode: {
                size: [10, 10],
                color: 'steelblue',
            },
            defaultEdge: {
                size: 1,
            },
            nodeStyle: {
                default: {
                    lineWidth: 2,
                    fill: 'steelblue',
                },
                highlight: {
                    opacity: 1,
                },
                dark: {
                    opacity: 0.2,
                },
            },
            edgeStyle: {
                default: {
                    stroke: '#e2e2e2',
                    lineAppendWidth: 2,
                },
                highlight: {
                    stroke: '#999',
                },
            },*/
            minZoom: 0.1,
        });
        
        state.Graph = graph;
        window.graph = graph;
    }
    
    let simulate = data => {
        let ticked = () => {
            state.Graph.refreshPositions();
            state.Graph.paint();
            state.Graph.fitView();
        }
        var simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(function (d) {
                return d.id;
            }).distance(50).strength(0.5))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
            .force("collide", d3.forceCollide(props.config.collideRadius).strength(0.2).iterations(5));
        simulation.nodes(data.nodes).on('tick', ticked);
        simulation.force('link').links(data.edges);
    }
    
    let draw = data => {
        let graph = state.Graph;
        
        let nodeMap = {};
        
        graph.node(node => {
            nodeMap[node.id] = node;
            return {
                ...node,
                id: node.id,
                size: node.size,
                shape: 'textShape',
                x: node.x,
                y: node.y,
                // text: node.properties.text,
                style: {
                    fill: node.color
                },
                /*labelCfg: {
                    position: 'bottom',
                    fontSize: 5
                },*/
            };
        });
        
        graph.edge(edge => {
            return {
                ...edge,
                label: edge.properties.name,
                labelCfg: {
                    style: {
                        fontSize: 8
                    },
                },
                style: {
                    endArrow: true,
                }
            };
        });
        
        graph.data({
            nodes: data.nodes,
            edges: data.edges.map(function (edge, i) {
                edge.id = 'edge' + i;
                return Object.assign({}, edge);
            }),
        });
        
        simulate(data);
        
        graph.render();
        
        listen();
    };
    
    let listen = () => {
        let graph = state.Graph;
        
        /*function clearAllStats() {
            graph.setAutoPaint(false);
            graph.getNodes().forEach(function (node) {
                graph.clearItemStates(node);
            });
            graph.getEdges().forEach(function (edge) {
                graph.clearItemStates(edge);
            });
            graph.paint();
            graph.setAutoPaint(true);
        }
        
        graph.on('node:mouseenter', function (e) {
            var item = e.item;
            graph.setAutoPaint(false);
            graph.getNodes().forEach(function (node) {
                graph.clearItemStates(node);
                graph.setItemState(node, 'dark', true);
            });
            graph.setItemState(item, 'dark', false);
            graph.setItemState(item, 'highlight', true);
            graph.getEdges().forEach(function (edge) {
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
        graph.on('node:mouseleave', clearAllStats);
        graph.on('canvas:click', clearAllStats);*/
        
        function hideAll() {
            graph.setAutoPaint(false);
            graph.getNodes().forEach(function (node) {
                node.hide();
            });
            graph.getEdges().forEach(function (edge) {
                edge.hide();
            });
            graph.paint();
            graph.setAutoPaint(true);
        }
        
        function showAll() {
            graph.setAutoPaint(false);
            graph.getNodes().forEach(function (node) {
                node.show();
            });
            graph.getEdges().forEach(function (edge) {
                edge.show();
            });
            graph.paint();
            graph.setAutoPaint(true);
        }
        
        graph.on('node:dblclick', function (ev) {
            var item = ev.item;
            if (item && item.get('type') === 'node') {
                hideAll();
                item.show();
                let edges = item.getEdges(); //item.get('edges');
                edges.map(edge => {
                    edge.show();
                    edge.getSource().show();
                    edge.getTarget().show();
                });
                graph.refresh();
                graph.fitView();
            }
        });
        
        graph.on('node:click', function (ev) {
            if(props.config.callback) props.config.callback(ev.item);
        });
    
        graph.on('canvas:click', function (ev) {
            showAll();
            graph.fitView();
        });
    };
    
    return (
        <div id={state.divId} ref={divRef}></div>
    );
}

export default ForceDirect;