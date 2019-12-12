import React, { useState, useEffect, useRef } from 'react';
import UUID from 'uuid-js';
import G6 from '@antv/g6';
import * as d3 from 'd3';

function ForceDirect(props) {
    
    const divRef = useRef();
    const [state, setState] = useState({
        divId: UUID.create().toString(),
        Graph: null,
    });
    
    useEffect(() => {
        // if (props.data.nodes && props.data.nodes.length !== 0) {
        if (false && (!props.config.reparable) && state.Graph) {
            state.Graph.changeData({
                nodes: props.data.nodes,
                edges: props.data.edges.map(function(edge, i) {
                    edge.id = 'edge' + i;
                    return Object.assign({}, edge);
                }),
            });
        } else {
            divRef.current.innerHTML = '';
            initGraph();
            draw(props.data);
        }
        // }
    }, [props]);
    
    let initGraph = () => {
        G6.registerNode('textShape', {
            draw(cfg, group) {
                const circle = group.addShape('circle', {
                    attrs: {
                        x: 0,
                        y: 0,
                        r: cfg.size / 2,
                        fill: cfg.color,
                    },
                });
                const text = group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: -10,
                        textAlign: 'center',
                        fontSize: 10,
                        text: cfg.label,
                        fill: '#444',
                    },
                });
                return circle;
            },
        });
        
        G6.registerLayout('forcedirect', {
            getDefaultCfg: function getDefaultCfg() {
                return {
                    collideRadius: 50,
                };
            },
            execute: function execute() {
                let self = this;
                let collideRadius = self.collideRadius;
                let nodes = self.nodes;
                let edges = self.edges;
                
                let ticked = () => {
                    graph.refresh();
                    graph.fitView();
                };
                var simulation = d3.forceSimulation()
                    .force('link', d3.forceLink().id(d => d.id).distance(50).strength(0.5))
                    .force('charge', d3.forceManyBody())
                    // .force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
                    .force('collide', d3.forceCollide(collideRadius).strength(0.2).iterations(5));
                simulation.nodes(nodes).on('tick', ticked);
                simulation.force('link').links(edges);
            },
        });
        
        let { config } = props;
        let width = config.width ? config.width : divRef.current.offsetWidth;
        let height = config.height ? config.height : divRef.current.offsetWidth * 9 / 16;
        
        let modes = {
            default: ['drag-canvas', /*{
                type: 'zoom-canvas',
                sensitivity: 1,
            }*/],
        };
        
        let layout = {
            type: 'force',
            linkDistance: 80,         // 可选，边长
            nodeStrength: -70,         // 可选
            edgeStrength: 1,        // 可选
            collideStrength: 8,     // 可选
            alpha: 0.3,               // 可选
            alphaDecay: 0.02,        // 可选
            alphaMin: 0.01,           // 可选
            forceSimulation: null,    // 可选
            nodeSize: 10,
        };
        
        /*let layout = {
            type: 'forcedirect',
            collideRadius: 50,
        };*/
        
        let graph = new G6.Graph({
            container: state.divId,
            width: width,
            height: height,
            modes: modes,
            layout: layout,
            autoPaint: true,
            minZoom: 1 / props.config.zoomSize,
            maxZoom: props.config.zoomSize,
        });
        
        state.Graph = graph;
    };
    
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
                style: {
                    fill: node.color,
                },
            };
        });
        
        graph.edge(edge => {
            return {
                ...edge,
                label: edge.properties.name,
                labelCfg: {
                    style: {
                        fontSize: 8,
                    },
                },
                style: {
                    endArrow: true,
                },
            };
        });
        
        graph.data({
            nodes: data.nodes,
            edges: data.edges.map(function(edge, i) {
                // edge.id = 'edge' + i;
                return Object.assign({}, edge);
            }),
        });
        
        graph.render();
        
        eventListener();
    };
    
    let eventListener = () => {
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
            graph.getNodes().forEach(function(node) {
                node.hide();
            });
            graph.getEdges().forEach(function(edge) {
                edge.hide();
            });
            graph.paint();
            graph.setAutoPaint(true);
        }
        
        function showAll() {
            graph.setAutoPaint(false);
            graph.getNodes().forEach(function(node) {
                node.show();
            });
            graph.getEdges().forEach(function(edge) {
                edge.show();
            });
            graph.paint();
            graph.setAutoPaint(true);
        }
        
        let timeId;
        
        graph.on('node:click', function(ev) {
            clearTimeout(timeId);
            timeId = setTimeout(() => {
                graph.fitView();
                if(props.config.callback) {
                    props.config.callback(ev.item);
                }
            }, 300);
        });
        
        graph.on('node:dblclick', function(ev) {
            clearTimeout(timeId);
            setTimeout(() => {
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
                graph.fitView();
            }, 300);
        });
        
        graph.on('canvas:click', function (ev) {
            showAll();
            graph.fitView();
        })
    };
    
    return (
        <div id={state.divId} ref={divRef}></div>
    );
}

export default ForceDirect;
