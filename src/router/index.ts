import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'
import AddPicturePage from '@/pages/AddPicturePage.vue'
import PictureManagePage from "@/pages/admin/PictureManagePage.vue";
import PictureDetailPage from "@/pages/PictureDetailPage.vue";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";
import {useLoginUserStore} from "@/stores/useLoginUserStore";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta:{
                access:ACCESS_ENUM.USER,
            },
        },
        {
            path: '/user/login',
            name: '用户登录',
            component: UserLoginPage,
        },
        {
            path: '/user/register',
            name: '用户注册',
            component: UserRegisterPage,
        },
        {
            path: '/admin/userManage',
            name: '用户管理',
            component: UserManagePage,
            meta:{
                access:ACCESS_ENUM.ADMIN,
            },
        },
        {
            path: '/admin/pictureManage',
            name: '图片管理',
            component: PictureManagePage,
            meta:{
                access:ACCESS_ENUM.ADMIN,
            },
        },
        {
            path: '/add_picture',
            name: '创建图片',
            component: AddPicturePage,
            meta:{
                access:ACCESS_ENUM.USER,
            },
        },
        {
            path: '/picture/:id',
            name: '图片详情',
            component: PictureDetailPage,
            props: true,
            meta:{
                access:ACCESS_ENUM.USER,
            },
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },
    ],
})


router.beforeEach(async (to, from, next) => {
    console.log('beforeEach 钩子执行了！') // ✅ 这里应该打印日志
    const loginUserStore = useLoginUserStore()
    let loginUser = loginUserStore.loginUser

    if (!loginUser || !loginUser.userRole) {
        console.log('用户未登录，获取最新用户信息...')
        await loginUserStore.fetchLoginUser()
        loginUser = loginUserStore.loginUser
    }

    console.log('当前用户信息:', loginUser)

    const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN
    if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
        if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
            console.log('未登录，跳转到登录页面')
            next(`/user/login?redirect=${to.fullPath}`)
            return
        }

        if (!checkAccess(loginUser, needAccess)) {
            console.log('权限不足，跳转到无权限页面')
            next('/noAuth')
            return
        }
    }
    next()
})


export default router
