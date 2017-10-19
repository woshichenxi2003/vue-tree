<script>

export default {
    name: 'tree',
    components: {},
    data() {
        return {
            newNode: this.reBuildData(this.treeData)
        }

    },
    props: {
        treeData: Array,
        isMultiple: {
            type: String,
            default: 'false'
        },
        isAllOpen: {
            type: String,
            default: 'false'
        },
        isShowcheck: {
            type: String,
            default: 'true'
        }
    },
    methods: {
        //数据重建方法
        reBuildData(arr) {
            var newArr = [];
            arr.forEach((ele, index) => {
                if (ele._parentId == null) {
                    // 给父节点添加自定义属性 初始化只有根目录显示不打开子目录
                    this.$set(ele, 'isShow', true);
                    this.$set(ele, 'isChecked', false);
                    this.isAllOpen == 'true' ? this.$set(ele, 'isOpen', true) : this.$set(ele, 'isOpen', false);
                    this.$set(ele, 'childNode', this.checkChildNode(ele.id, arr));
                    newArr.push(ele);
                }
            }, this)

            return newArr
        },
        //找出一个id下的所有子节点的方法 ，用于在递归遍历中
        checkChildNode(cId, arr) {
            let currentArr = [];
            arr.forEach(function(element, index) {
                if (element._parentId == cId) {
                    //找到子元素后继续寻找子元素的子元素
                    this.isAllOpen == 'true' ? this.$set(element, 'isOpen', true) : this.$set(element, 'isOpen', false);
                    this.$set(element, 'isChecked', false);
                    this.$set(element, 'isShow', true);
                    this.$set(element, 'childNode', this.checkChildNode(element.id, arr));
                    currentArr.push(element);
                }
            }, this);
            return currentArr;
        },

        createNode(h, item) {
            let This = this;
            if (item.isShow) {
                return h('div', {
                    'class': {
                        'checkbox_con': true
                    }
                }, [
                        h(
                            'div', {
                                'class': {
                                    'msg_box': true
                                },
                            }, [
                                // 加入下拉箭头子元素
                                h('span', {
                                    'class': {
                                        'checkbox_arrow_box': true
                                    }
                                }, [
                                        (function() {
                                            if (item.childNode.length) {
                                                return h('i', {
                                                    'class': {
                                                        'checkbox_arrow': true,
                                                        'expanded': item.isOpen
                                                    },
                                                    domProps: {
                                                        linkData: item
                                                    },
                                                    on: {
                                                        click: function(event) {
                                                            This.show_down(event)
                                                        }

                                                    }
                                                }, '')
                                            }
                                        })()
                                    ]),
                                //增加选择框元素
                                (function() {
                                    if (This.isShowcheck == 'true') {
                                        return h(
                                            'i', {
                                                'class': {
                                                    'checkbox_inner': true,
                                                    'checked_active': item.isChecked
                                                },
                                                domProps: {
                                                    linkData: item
                                                },
                                                on: {
                                                    click: function(event) {
                                                        This.checkedNode(event)
                                                    }
                                                }
                                            }, ''
                                        )
                                    }
                                })(),
                                //增加msg显示元素
                                h(
                                    'span', {
                                        'class': {
                                            'checkbox_msg': true
                                        },
                                        domProps: {
                                            linkData: item
                                        },
                                        on: {
                                            click: function(event) {
                                                This.pitchOneNode(event)
                                            }
                                        }
                                    }, [item.name]
                                ),
                            ]
                        ),
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
        judgmentParentNode(cid, type) {
            //判断父级下面的子集是否都是关闭的 如果都关闭了 取消父级的选中
            if (cid != null) {
                //建一个变量等待缓存找出的node节点
                let currentNode = {};
                //循环整个数据找出id为cid的节点
                this.treeData.forEach(function(element) {
                    if (element.id == cid) {
                        currentNode = element;
                    }
                }, this);
                //判断节点是否有子节点 有子节点的情况下判断 所有子节点是否都已经关闭
                if (currentNode.childNode.length) {
                    //如果是选中 父级直接勾选 并且递归  如果是取消勾选 需判断父级是否所有子类都已经取消勾选
                    if (type == true) {
                        currentNode.isChecked = type;
                        this.judgmentParentNode(currentNode._parentId, type);
                    } else {
                        let currentNum = 0; //计数
                        currentNode.childNode.forEach(function(element) {
                            (element.isChecked == type) && currentNum++
                        }, this);
                        if (currentNode.childNode.length == currentNum) {
                            currentNode.isChecked = type;
                            //如果自己关闭了 还得去检查父级是否关闭了
                            this.judgmentParentNode(currentNode._parentId, type);
                        }
                    }
                }
            } else {
                return
            }
        },
        recheckedchildNode() {
            let currentArr = [];
            this.treeData.forEach(function(element) {
                if (element.childNode.length == 0) {
                    if (element.isChecked) {
                        currentArr.push(JSON.parse(JSON.stringify(element)))
                    }
                }
                // (element.childNode.length == 0) && element.isChecked && currentArr.push(JSON.parse(JSON.stringify(element)))
            }, this);
            return currentArr;
        },
        checkedNode(eve) {
            let linkData = eve.srcElement.linkData;
            //控制子元素同步
            this.findNodeAndSet('isChecked', !linkData.isChecked, linkData.childNode);
            linkData.isChecked = !linkData.isChecked
            // 判断父元素是否所有子节点都已经关闭或者开启 需递归
            this.judgmentParentNode(linkData._parentId, linkData.isChecked);
            //向外发送事件
            //筛选所有选中的子节点

            this.$emit('incheckednode', this.recheckedchildNode());
            eve.stopPropagation();

        },
        //修改后的递归子节点赋值方法
        findNodeAndSet(key, value, arr) {
            arr.forEach(function(element) {
                element[key] = value;
                if (element.childNode.length) {
                    this.findNodeAndSet(key, value, element.childNode)
                }
            }, this);
        },
        show_down(eve) {
            let linData = eve.srcElement.linkData;
            this.$emit('inpulldown', JSON.parse(JSON.stringify(linData)), !linData.isOpen);
            linData.isOpen = !linData.isOpen
            eve.stopPropagation();
        },
        pitchOneNode(eve) {
            let linkData = eve.srcElement.linkData;
            this.$emit('inselectnode', JSON.parse(JSON.stringify(linkData)))
        }

    },
    render: function(h) {
        let This = this;
        window.newNode = this.newNode;
        return h('div', {
            'class': {
                'tree_con': true
            },
            attrs: {
                onselectstart: "javascript:return false;"
            }
        }, this.newNode.map((item) => {
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
    font-size: 14px;
}

.msg_box {
    display: flex;
}

.checkbox_con .checkbox_inner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #cdcdcd;
    border-radius: 25%;
    vertical-align: middle;
    cursor: pointer;
    margin-top: 7px;
}

.checkbox_arrow_box {
    display: inline-block;
    width: 12px;
    margin-right: 5px;
    line-height: 28px;
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
    cursor: pointer;
    flex: 1;
}

.checkbox_con .child_con {
    /* width: 94%; */
    height: 0;
    transition: height 0.3s ease-in-out;
    padding-left: 16px;
    padding-right: 6px;
}

.checkbox_con .child_con.active {
    height: auto;
}

.checkbox_con .checkbox_inner.checked_active {
    border: 2px solid #1a97db;
    border-radius: 25%;
}

.checkbox_con .checkbox_inner.checked_active:before {
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


