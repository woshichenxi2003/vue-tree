<template>
    <div id="app">
        <tree :treeData="treeDataone"
        :isAllOpen="true"
        @inselectnode="selectnode"
        @inpulldown="pulldown"
        @incheckednode="checkednode"
        :isShowcheck="true"
        :isMultiple="true"
        :depthShow="2"></tree>
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
    }
  }
};
</script>

<style>

</style>
