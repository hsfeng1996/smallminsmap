import React from 'react';
import ForceGraph from './ForceGraph';

class Force extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    };
  }
  
  random = (min,max) => {
    return Math.floor(Math.random()*(max-min+1))+min;
  }
  
  format = (data) => {
    const { colorMap } = this.props.config;
    let nodes = data.nodes.map((value,index)=>{
      return {
        size: this.props.config.size,
        style: {
          fill: colorMap[value.label],
        },
        type: value.label,
        ...value,
        label: value.properties.name,
        id: `n_${value.id}`,
      };
    });
    let edges = data.edges.map((value,index)=>{
      return {
        ...value, 
        id:`r_${value.id}`, 
        source: `n_${value.sourceNode.id}`, 
        target: `n_${value.targetNode.id}`,
      };
    });
    return {nodes:nodes,edges:edges};
  }
  
  createGraph = () => {
    const { data, config } = this.props;
    return <ForceGraph data={this.format(data)} config={config} />;
  };
  
  render(){
    return (
      <div> {this.createGraph()} </div>
    );
  }
}


export default Force;