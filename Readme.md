# Smallminsmap说明文档

## 1. 安装模块

```
npm install –save-dev smallminsmap
```

## 2. 使用说明

第一步 导入模块（minsmap）

```
import minsmap from ‘smallminsmap’;  // <script src="index.js"></script>
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

  	showLabel: true,

 	colorMap: {},

 	callback: null,

} //默认配置
```

第五部 生成图形

```
minsmap(el,data,config);  // initGraph(document.getElementById('root'),data.data,{});
```

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

	// SELECT, INSERT, UPDATE, DELETE

	status: “”,

	properties: {},

}
```

边edge: 

```
{

	id: “”,

	type: “”,

	// SELECT, INSERT, UPDATE, DELETE

	status: “”,

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

 	// showLabel: true, // 是否显示标签

 	colorMap: {}, // 节点颜色映射（节点颜色设置）

 	callback: null, // 单击回调函数，例：(model)=>{console.log(model)}

}
```

