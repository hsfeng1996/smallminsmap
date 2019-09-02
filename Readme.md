# Smallminsmap说明文档

## 1. 安装模块

```
npm install –save-dev smallminsmap
```

## 2. 使用说明

第一步 导入模块（minsmap）

```
import minsmap from ‘smallminsmap’;  
// <script src="index.js"></script>
// 全局函数initGraph, 全局变量-图：graph
```

第二步 创建容器（dom元素）

```
<div id='root'></div>
```

```
let el = document.getElementById('root');
```

第三步 获取数据

```
let data = {nodes:[], edges:[]}
```

第四步 创建配置

```
let config = {
    width: 500,
    height: 500,
    size: 30,
    colorMap: {},
    callback: null, // 双击事件，传入参数 节点node
} //默认配置
```

第五部 生成图形

```
minsmap(el,data,config);  
// initGraph(document.getElementById('root'),data.data,{});
```

第六部 图操作

```
获取节点：
graph.getNodes();
const item = graph.findById('node1');
获取边：graph.getEdges();
节点样式更新：
graph.update(item,{size:35});
graph.update(item, {
    x: 10,
    y: 20
});
```

参考：[https://www.yuque.com/antv/g6/graph](https://www.yuque.com/antv/g6/graph)

## 3. 数据说明

图数据data

```
{nodes:[node, node, …], edegs:[edge, edge, …]}
```

节点node: 

```
{
    id: -1,
    label: “”,
    properties: {},
}
```

边edge: 

```
{
    id: “”,
    type: “”,
    properties: {},
    sourceNode: {},
    targetNode: {},
}
```

配置config

```
{
    width: 500, // 图的宽度
    height: 500, // 图的高度
    size: 30, // 节点大小，默认30px
    colorMap: {}, // 节点颜色映射（节点颜色设置）
    autoFitView: true, // 画布内容自适应视口
    callback: null, // 单击回调函数，例：(item)=>{console.log(item)}
}
```
