import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./components/Home.vue"
import Login from "./components/Login.vue"
import Search from "./components/Search.vue"
import History from "./components/History.vue"
import Operation from "./components/Operation.vue"
import Command from "./components/Command.vue"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/Login',
            component: Login
        },
        {
            path: '/Search',
            component: Search
        },
        {
            path: '/History',
            component: History
        },
        {
            path: '/Operation/:type',
            component: Operation
        }
        ,
        {
            path: '/Command/:type',
            component: Command
        }
    ]
});

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token');
    if(!token && to.path != '/Login'){
        next("/Login");
        return;
    }
    if(token && to.path == '/Login'){
        next("/");
        return;
    }
    next();
});

export default router;