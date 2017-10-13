<template>
  <div class="tree-node" onselectstart="return false">
    <div class="checkbox_con">
      <span class="checkbox_arrow_box" @click.stop="show_down($event)">
        <i class="checkbox_arrow"></i>
      </span>
      <span class="checkbox_inner" @click.stop="show($event)"></span>
      <span class="checkbox_msg">这是一个</span>
      <div class="child_con">
        <div class="checkbox_con">
          <span class="checkbox_inner "></span>
          <span class="checkbox_msg ">这是一个</span>
        </div>
        <div class="checkbox_con ">
          <span class="checkbox_inner "></span>
          <span class="checkbox_msg ">这是一个</span>
        </div>
        <div class="checkbox_con ">
          <span class="checkbox_inner "></span>
          <span class="checkbox_msg ">这是一个</span>
        </div>
      </div>
    </div>
    <div class="checkbox_con">
      <span class="checkbox_arrow_box" @click.stop="show_down($event)">
        <i class="checkbox_arrow"></i>
      </span>
      <span class="checkbox_inner" @click.stop="show($event)"></span>
      <span class="checkbox_msg">这是一个</span>
      <div class="child_con">
        <div class="checkbox_con">
          <span class="checkbox_inner "></span>
          <span class="checkbox_msg ">这是一个</span>
        </div>
        <div class="checkbox_con ">
          <span class="checkbox_inner "></span>
          <span class="checkbox_msg ">这是一个</span>
        </div>
        <div class="checkbox_con ">
          <span class="checkbox_inner "></span>
          <span class="checkbox_msg ">这是一个</span>
        </div>
      </div>
    </div>
    <div class="checkbox_con">
      <span class="checkbox_arrow_box" @click.stop="show_down($event)">
        <i class="checkbox_arrow"></i>
      </span>
      <span class="checkbox_inner" @click.stop="show($event)"></span>
      <span class="checkbox_msg">这是一个</span>
      <div class="child_con">
        <div class="checkbox_con">
          <span class="checkbox_arrow_box" @click.stop="show_down($event)">
            <i class="checkbox_arrow"></i>
          </span>
          <span class="checkbox_inner" @click.stop="show($event)"></span>
          <span class="checkbox_msg">这是一个</span>
          <div class="child_con">
            <div class="checkbox_con">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
            <div class="checkbox_con ">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
            <div class="checkbox_con ">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
          </div>
        </div>
        <div class="checkbox_con">
          <span class="checkbox_arrow_box" @click.stop="show_down($event)">
            <i class="checkbox_arrow"></i>
          </span>
          <span class="checkbox_inner" @click.stop="show($event)"></span>
          <span class="checkbox_msg">这是一个</span>
          <div class="child_con">
            <div class="checkbox_con">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
            <div class="checkbox_con ">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
            <div class="checkbox_con ">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
          </div>
        </div>
        <div class="checkbox_con">
          <span class="checkbox_arrow_box" @click.stop="show_down($event)">
            <i class="checkbox_arrow"></i>
          </span>
          <span class="checkbox_inner" @click.stop="show($event)"></span>
          <span class="checkbox_msg">这是一个</span>
          <div class="child_con">
            <div class="checkbox_con">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
            <div class="checkbox_con ">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
            <div class="checkbox_con ">
              <span class="checkbox_inner "></span>
              <span class="checkbox_msg ">这是一个</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="checkbox_con">
      <span class="checkbox_arrow_box" @click.stop="show_down($event)">
      </span>
      <span class="checkbox_inner" @click.stop="show($event)"></span>
      <span class="checkbox_msg">这是一个</span>
    </div>
  </div>
</template>

      [
        {
          isShow: true, isChecked: false, isOpen: false, parentNode: 'rootNode', currentMsg: '第一个父节点', childrenNodes: [
            { isShow: true, isChecked: false, isOpen: false, parentNode: '0', currentMsg: '第一个父节点', childrenNodes: [] },
            {
              isShow: true, isChecked: false, isOpen: false, parentNode: '0', currentMsg: '第一个父节点', childrenNodes: [
                { isShow: true, isChecked: false, isOpen: false, parentNode: '1', currentMsg: '第二个节点的第一个子节点', childrenNodes: [] },
                { isShow: true, isChecked: false, isOpen: false, parentNode: '1', currentMsg: '第二个节点的第二个子节点', childrenNodes: [] },
                { isShow: true, isChecked: false, isOpen: false, parentNode: '1', currentMsg: '第二个节点的第二个子节点', childrenNodes: [] },
              ]
            },
            { isShow: true, isChecked: false, isOpen: false, parentNode: '0', currentMsg: '第一个父节点', childrenNodes: [] },
          ]
        },
        {
          isShow: true, isChecked: false, isOpen: false, parentNode: 'rootNode', currentMsg: '第二个子节点', childrenNodes: [
            { isShow: true, isChecked: false, isOpen: false, parentNode: '1', currentMsg: '第二个节点的第一个子节点', childrenNodes: {} },
            { isShow: true, isChecked: false, isOpen: false, parentNode: '1', currentMsg: '第二个节点的第二个子节点', childrenNodes: {} },
            { isShow: true, isChecked: false, isOpen: false, parentNode: '1', currentMsg: '第二个节点的第二个子节点', childrenNodes: {} },
          ]
        }
      ]


// currentNode.forEach(function(ele, index) {
            //   if (ele._parentId === null) {
            //     //给父节点添加自定义属性 初始化只有根目录显示不打开子目录
            //     ele.isShow = true;
            //     ele.isChecked = false;
            //     ele.isOpen = true;
            //     //删除数组中的元素
            //     currentNode.splice(index, 1);
            //     //循环数组找出子元素
            //     currentNode.forEach(function(e, i) {

            //     })
            //     ele.childrenNode = []
            //   } else {
            //     //给子类增加自定义数据
            //     ele.isShow = false;
            //     ele.isChecked = false;
            //     ele.isOpen = true;
            //   }
            //   newNode.push(ele);
            // }, this);
            // console.log(newNode);//调试 显示 计算后的对象 后期删除
