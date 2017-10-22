import Vue from 'vue'
import Router from 'vue-router'
import Tree from '@/components/tree'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Tree',
        component: Tree
    }]
})