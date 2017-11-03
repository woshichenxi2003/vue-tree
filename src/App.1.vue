<template>
    <div id="app">
        <tree :treeData="treeDataone"
        :isAllOpen="true"
        @inselectnode="selectnode"
        @inpulldown="pulldown"
        @incheckednode="checkednode"
        :isShowcheck="true"
        :isMultiple="true"
        :depthShow="3"></tree>
        <button @click="handleclick">增加对象</button>
    </div>

</template>

<script>
import tree from "./components/tree";
import { treeData } from "../static/data";
export default {
  name: "app",
  data() {
    return {
      treeDataone: treeData
    };
  },
  components: {
    tree
  },
  methods: {
    pulldown(obj, type) {
      console.log(obj, type);
    },
    selectnode(obj) {
      console.log(obj);
    },
    checkednode(arr) {
      console.log(arr);
    },
    handleclick() {
      //   this.treeDataone.push({
      //     _parentId: null,
      //     pId: null,
      //     id: "1",
      //     dicId: null,
      //     name: "kkkkkkk",
      //     parentName: null,
      //     orderNo: 1,
      //     fullPath: "1",
      //     property: 0
      //   });
      //   console.log(this.treeDataone);
      this.treeDataone[0].name = "sdfkskdf";
    }
  }
};
</script>

<style>

</style>
