<script>

export default {
    name: 'tree',
    components: {},
    data() {
        return {
            node: this.treeData,
            newNode: []
        }

    },
    computed: {
        newTreeData() {
            //重构后的数据且初始化数据
            // let newNode = [];
            //深度复制node给currentNode
            let currentNode = this.copeArr(this.node);
            this.reBuildData(currentNode, this.newNode);
            return this.newNode
        }
    },
    props: ['treeData', 'isMultiple'],
    methods: {
        //深度赋值node数组的方法
        copeArr(arr) {
            let newArr = [];
            arr.forEach(function(element) {
                newArr.push(JSON.parse(JSON.stringify(element)));
            }, this);
            return newArr
        },
        //数据重建方法
        reBuildData(arr, outArr) {
            arr.forEach((ele, index) => {
                if (ele._parentId == null) {
                    // 给父节点添加自定义属性 初始化只有根目录显示不打开子目录
                    ele.isShow = true;
                    ele.isChecked = false;
                    ele.isOpen = false;
                    ele.childNode = this.checkChildNode(ele.id, arr);
                    outArr.push(JSON.parse(JSON.stringify(ele)));
                }
            })
        },
        //找出一个id下的所有子节点的方法 ，用于在递归遍历中
        checkChildNode(cId, arr) {
            let num = 0;
            let currentArr = [];
            arr.forEach(function(element, index) {
                if (element._parentId == cId) {
                    //找到子元素后继续寻找子元素的子元素
                    element.isShow = true;
                    element.isChecked = false;
                    element.isOpen = false;
                    element.childNode = this.checkChildNode(element.id, arr);
                    currentArr.push(JSON.parse(JSON.stringify(element)));
                }
            }, this);
            return currentArr;
        },
        findNodeAndSet(id, key, value, arr) {
            console.log(id, key, value, arr)
            arr.forEach(function(element) {
                if (element.id == id) {
                    element[key] = value;
                    return
                } else if (element.childNode.length) {
                    this.findNodeAndSet(id, key, value, element.childNode)
                }
            }, this);
        },
        createNode(h, item) {
            let This = this;
            if (item.isShow) {
                return h('div', {
                    'class': {
                        'checkbox_con': true
                    }
                }, [
                        // 加入下拉箭头子元素
                        h('span', {
                            'class': {
                                'checkbox_arrow_box': true
                            },
                            on: {
                                click: function(event) {
                                    This.show_down(event)
                                }

                            }
                        }, [
                                (function() {
                                    if (item.childNode.length) {
                                        return h('i', {
                                            'class': {
                                                'checkbox_arrow': true
                                            },
                                            attrs: {
                                                nodeId: item.id,
                                                parentNodeId: item._parentId
                                            }
                                        }, '')
                                    }
                                })()
                            ]),
                        //增加选择框元素
                        h(
                            'i', {
                                'class': {
                                    'checkbox_inner': true
                                },
                                on: {
                                    click: function(event) {
                                        This.show(event)
                                    }
                                }
                            }, ''
                        ),
                        //增加msg显示元素
                        h(
                            'span', {
                                'class': {
                                    'checkbox_msg': true
                                }
                            }, [item.name]
                        ),
                        //增加子元素
                        h(
                            'div', {
                                'class': {
                                    'child_con': true,
                                    'active': item.isOpen
                                }
                            }, (function() {
                                let arr = [];
                                if (item.childNode) {
                                    //遍历 递归调用子类
                                    item.childNode.map(function(element) {
                                        arr.push(This.createNode(h, element));
                                    }, this);
                                }
                                return arr
                            })()
                        )

                    ])
            }
        },
        show(eve) {
            let _parent = eve.srcElement.parentNode;
            let _current = eve.srcElement;
            _parent.classList.toggle("checked_active");

        },
        show_down(eve) {
            // let _parent = eve.srcElement.parentNode;
            // let _current = eve.srcElement;
            // let _currentId = eve.srcElement.nodeId;
            // if (_parent.parentNode.children[3]) {
            //     _parent.parentNode.children[3].classList.add('active');
            //     _current.classList.add('expanded');
            // }
            //获得标签的id
            let _currentId = eve.srcElement.getAttribute('nodeid');
            this.findNodeAndSet(_currentId, 'isOpen', true, this.newNode);
            console.log(_currentId);
            eve.stopPropagation();
        }

    },
    render: function(h) {
        let This = this;
        return h('div', {
            'class': {
                'tree_con': true
            }
        }, this.newTreeData.map((item) => {
            return This.createNode(h, item);
        }))
    }

}
</script>
<style>
.tree_con {
    width: 100%;
}

.checkbox_con {
    padding-left: 5px;
    width: 100%;
    text-align: left;
    line-height: 30px;
    overflow: hidden;
    /* cursor: pointer; */
}

.checkbox_con .checkbox_inner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #cdcdcd;
    border-radius: 25%;
    vertical-align: middle;
    cursor: pointer;
}

.checkbox_arrow_box {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    line-height: 30px;
}

.checkbox_con .checkbox_arrow {
    display: inline-block;
    width: 0px;
    height: 0px;
    border: 6px solid transparent;
    vertical-align: middle;
    cursor: pointer;
    border-right-width: 0;
    border-left-color: #97a8be;
    border-left-width: 7px;
    transform: rotate(0deg);
    transition: transform .3s ease-in-out;
}

.checkbox_con .checkbox_arrow.expanded {
    transform: rotate(90deg);
}

.checkbox_con .checkbox_msg {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
}

.checkbox_con .child_con {
    height: 0;
    transition: height 0.6s ease-in-out;
    padding-left: 16px;
}

.checkbox_con .child_con.active {
    height: auto;
}

.checkbox_con.checked_active>.checkbox_inner {
    border: 2px solid #1a97db;
    border-radius: 25%;
}

.checkbox_con.checked_active>.checkbox_inner:before {
    position: relative;
    top: 0px;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    content: "";
    font-weight: bold;
    background: url('../assets/tick.png') center no-repeat;
    background-size: 100% auto;
}
</style>


