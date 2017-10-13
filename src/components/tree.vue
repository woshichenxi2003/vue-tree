<script>

export default {
    name: 'tree',
    components: {},
    data() {
        return {
            node: this.treeData
        }

    },
    computed: {
        newTreeData() {
            //重构后的数据且初始化数据
            let newNode = [];
            let currentNode = this.node;



            console.log(this.reBuildData(currentNode));;


            return newNode
        }
    },
    props: ['treeData'],
    methods: {
        //数据重建方法
        reBuildData(arr) {
            let currentArr = [...arr];
            console.log(currentArr);
            // arr.forEach(function(ele, index) {
            //     console.log(checkChildNode(ele._parentId, currentNode));
            // })
        },
        show(eve) {
            let _parent = eve.srcElement.parentNode;
            let _current = eve.srcElement;
            _parent.classList.toggle("checked_active");
        },
        show_down(eve) {
            let _parent = eve.srcElement.parentNode;
            let _current = eve.srcElement;
            if (_parent.parentNode.children[3]) {
                _parent.parentNode.children[3].classList.add('active');
                _current.classList.add('expanded');
            }
            eve.stopPropagation();
        },
        //找出一个id下的所有子节点的方法 ，用于在递归遍历中
        checkChildNode(cId, arr) {
            let currentArr = [];
            arr.forEach(function(element, index) {
                if (element._parentId == cId) {
                    currentArr.push(element);
                }
            }, this);
            return currentArr;
        }
    },
    render: function(h) {
        let This = this;
        return h('div', {
            'class': {
                'tree_con': true
            }
        }, this.newTreeData.map((item) => {
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
                                //增加下拉箭头图标
                                h('i', {
                                    'class': {
                                        'checkbox_arrow': true
                                    }
                                }, '')
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
                        )
                    ])
            }

        }))
    }

}
</script>
<style>
.tree_con {
    width: 100%;
}

.checkbox_con {
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
    width: 6px;
    height: 6px;
    margin-right: 5px;
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
    padding-left: 40px;
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


