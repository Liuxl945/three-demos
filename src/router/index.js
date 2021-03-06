import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
{
    path: '/',
    name: 'Home',
    component: Home
},
{
    path: '/about',
    name: 'About',
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
},
{
    path: '/css2d_label',
    name: 'css2d_label',
    component: () => import( /* webpackChunkName: "about" */ '../views/css2d_label.vue')
},
{
    path: '/css3d_orthographic',
    name: 'css3d_orthographic',
    component: () => import( /* webpackChunkName: "about" */ '../views/css3d_orthographic.vue')
},
{
    path: '/css3d_panorama',
    name: 'css3d_panorama',
    component: () => import( /* webpackChunkName: "about" */ '../views/css3d_panorama.vue')
},
{
    path: '/css3d_periodictable',
    name: 'css3d_periodictable',
    component: () => import( /* webpackChunkName: "about" */ '../views/css3d_periodictable.vue')
},
{
    path: '/misc_controls_drag',
    name: 'misc_controls_drag',
    component: () => import( /* webpackChunkName: "about" */ '../views/misc_controls_drag.vue')
},
{
    path: '/vr',
    name: 'vr',
    component: () => import( /* webpackChunkName: "about" */ '../views/vr.vue')
},
{
    path: '/fash_ice',
    name: 'fash_ice',
    component: () => import( /* webpackChunkName: "about" */ '../views/fash_ice.vue')
},
{
    path: '/index',
    name: 'index',
    component: () => import( /* webpackChunkName: "about" */ '../views/index.vue')
},
{
    path: '/photo',
    name: 'photo',
    component: () => import( /* webpackChunkName: "about" */ '../views/photo.vue')
},
{
    path: '/a_frame',
    name: 'a_frame',
    component: () => import( /* webpackChunkName: "about" */ '../views/a_frame.vue')
},
{
    path: '/misc_controls_pointerlock',
    name: 'misc_controls_pointerlock',
    component: () => import( /* webpackChunkName: "about" */ '../views/misc_controls_pointerlock.vue')
},
{
    path: '/misc_exporter_collada',
    name: 'misc_exporter_collada',
    component: () => import( /* webpackChunkName: "about" */ '../views/misc_exporter_collada.vue')
},
{
    path: '/misc_exporter_draco',
    name: 'misc_exporter_draco',
    component: () => import( /* webpackChunkName: "about" */ '../views/misc_exporter_draco.vue')
},
{
    path: '/raycaster',
    name: 'raycaster',
    component: () => import( /* webpackChunkName: "about" */ '../views/raycaster.vue')
}
]

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router