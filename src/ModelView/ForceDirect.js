import React from 'react';
import G6 from '@antv/g6';
import * as d3 from 'd3';

class ForceDirect extends React.Component {

    constructor(props){
        super(props);
        this.config = this.props.config;
    }

    componentDidMount() {
        this.initGraph();
        this.draw(this.props.data);
    }

    initGraph = () => {
        G6.registerNode('textShape', {
            draw(cfg, group) {
                const circle = group.addShape('circle', {
                    attrs: {
                        x: 0,
                        y: 0,
                        r: 10,
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

        let graph = new G6.Graph({
            container: 'forcedirect',
            width: this.config.width, // 900,
            height: this.config.height, // 600,
            modes: {
                default: ['drag-canvas', {
                    type: 'tooltip',
                    formatText: function formatText(model) {
                        return model.text?(model.name + ':<br/>' + model.text):model.name;
                    },
                }, {
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
                }],
            },
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

        this.graph = graph;
        window.graph = graph;
    }

    simulate = data => {
        let ticked = () => {
            this.graph.refreshPositions();
            this.graph.paint();
            this.graph.fitView();
        }
        var simulation = d3.forceSimulation().force('link', d3.forceLink().id(function(d) {
            return d.id;
        }).strength(0.5)).force('charge', d3.forceManyBody()).force('center', d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
        simulation.nodes(data.nodes).on('tick', ticked);
        simulation.force('link').links(data.edges);
    }

    draw = data => {
        let graph = this.graph;

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
                name: node.properties.name,
                text: node.properties.text,
                style: {
                    fill: node.color
                },
                labelCfg: {
                    position: 'bottom',
                    fontSize: 5
                },
            };
        });

        graph.edge(edge => {
            return {
                ...edge,
                source: edge.source,
                target: edge.target,
                color: nodeMap[edge.source].color,
            };
        });

        graph.data({
            nodes: data.nodes,
            edges: data.edges.map(function(edge, i) {
                edge.id = 'edge' + i;
                return Object.assign({}, edge);
            }),
        });
        this.simulate(data);
        graph.render();

        this.listen();
    };

    listen = () => {
        let graph = this.graph;
        let config = this.config;

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
        graph.on('node:mouseleave', clearAllStats);
        graph.on('canvas:click', clearAllStats);

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

        graph.on('node:click', function(ev) {
            var item = ev.item;
            if(item && item.get('type') === 'node') {
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

        graph.on('node:dblclick', function(ev) {
            showAll();
            graph.fitView();

            if(config.callback) config.callback(ev.item);
        });
    };

    render() {
        return (
            <div id="forcedirect"></div>
        );
    }
}

export default ForceDirect;