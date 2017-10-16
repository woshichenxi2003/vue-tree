<template>
    <div id="app">
        <tree :treeData="treeData" isAllOpen="true" @inselectnode="selectnode"></tree>
    </div>
</template>

<script>
import tree from "./components/tree";
import { treeData } from '../static/data';
window.treeData = treeData;
export default {
    name: 'app',
    data() {
        return {
            treeData
        }
    },
    components: {
        tree
    },
    methods: {
        selectnode(obj) {
            console.log(obj);
        }
    }

}
</script>

<style>

</style>
