<template>
    <div id="app">
        <tree :treeData="treeData"
        :isAllOpen="true"
        @inselectnode="selectnode"
        @inpulldown="pulldown"
        @incheckednode="checkednode"
        :isShowcheck="true"
        :isMultiple="true"
        :depthShow="3"></tree>
    </div>
</template>

<script>
import tree from "./components/tree";
import { treeData } from "../static/data";
export default {
  name: "app",
  data() {
    return {
      treeData
    };
  },
  components: {
    tree
  },
  methods: {
    selectnode(obj) {
      console.log(obj);
    },
    pulldown(obj, type) {
      console.log(obj, type);
    },
    checkednode(arr) {
      console.log(arr);
    }
  }
};
</script>

<style>

</style>
