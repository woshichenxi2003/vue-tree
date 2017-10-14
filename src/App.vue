<template>
    <div id="app">
        <tree :treeData="treeData"></tree>
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
    }
}
</script>

<style>

</style>
