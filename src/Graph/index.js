import React from 'react';
import $ from 'jquery';
import ForceGraph from './ForceGraph';

class Force extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedLabels: [],
      showLabel: true
    };
  }
  
  componentWillMount(){
    const { data } = this.props;
    this.format(data);
	}
  
  random (min,max){
    return Math.floor(Math.random()*(max-min+1))+min;
  }
  
  format(data){
    let selectedLabels = new Array();
    let nodes = data.nodes.map((value,index)=>{
      if(!selectedLabels.includes(value.label)) selectedLabels.push(value.label);
      return {
        size: 40,
        type: value.label,
        //degree: this.random(10,20),
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
    this.setState({data:{nodes:nodes,edges:edges}, selectedLabels});
  }
  
  createGraph(){
    let { data, selectedLabels, showLabel } = this.state;
    if(this.state.data)
      return <ForceGraph url='/neo4j/select/graph' data={data} types={selectedLabels} showLabel={showLabel}/>;
    return null;
  };
  
  render(){
    return (
      <> 123 </>
    );
  }
}


export default Force;