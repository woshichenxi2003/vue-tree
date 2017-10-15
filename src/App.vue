<template>
    <div id="app">
        <tree :treeData="treeData" isAllOpen="true" v-on:inselectnode="selectnode"></tree>
    </div>
</template>

<script>
import tree from "./components/tree";
import { treeData } from '../static/data';
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
