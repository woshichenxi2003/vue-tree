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
