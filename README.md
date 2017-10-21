# vue-tree
这是一个基于Vue的tree（多功能 “树插件”），能够根据参数提供多选，单选，只显示叶子节点等功能。This is a Vue based tree (multi-function "tree plug-in"), which can provide multiple choice according to the parameters, and only show leaf nodes and other functions.

```
<tree :treeData="treeData"
        isAllOpen="true"
        @inselectnode="selectnode"
        @inpulldown="pulldown"
        @incheckednode="checkednode"
        isShowcheck="true"
        isMultiple="true"></tree>
```

---
```
-   isAllOpen    “true”/"false" type:string  初始化是树结构是否全部打开
-   isShowcheck  “true”/"false" type:string  是否显示父类节点选择框
-   isMultiple   “true”/"false" type:string  是否多选 （多选状态需同时保证只能在isShowcheck为“true”）
-   selectnode   选中节点事件 返回值为节点对象 类型为Objecct
-   pulldown     下拉事件 返回值为节点对象和是打开还是关闭状态 类型为Objecct，Boolean
-   checkednode  点击选中事件  多选返回为一个数组，数组中为选中的节点元素 如果为单选  则放回一个对象
```

---
