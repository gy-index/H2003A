export default [
    //登陆页面路由
    {
        path: '/login',
        name: 'Login',
        component: () => import("@/views/login/Login.vue")
    },
    //后台首页页面
    {
        path: '/route',
        name: 'route',
        redirect: '/welcome',
        component: () => import("@/views/login/route.vue"),
        children: [{
                path: '/welcome',
                name: 'welcome',
                component: () => import("@/views/login/welcome.vue"),
            },
            // 用户列表页面
            {
                path: '/users',
                name: 'userlist',
                component: () => import("@/views/login/user/userlist.vue")
            },
            //角色列表页面
            {
                path: '/roles',
                name: 'roles',
                component: () => import("@/views/login/roles/Roles.vue")
            },
            //权限列表页面
            {
                path: '/rights',
                name: 'rights',
                component: () => import("@/views/login/rights/Rights.vue")
            },
            //商品列表页面
            {
                path: '/goods',
                name: 'goods',
                component: () => import("@/views/login/goods/Goods.vue"),
               
            },
            {
                path: '/goods/add',
                name: '/goods/add',
                component: () => import("@/views/login/goods/add.vue")
            },
            //分类参数页面
            {
                path: '/params',
                name: 'params',
                component: () => import("@/views/login/params/Params.vue")
            },
            //商品分类页面
            {
                path: '/categories',
                name: 'categories',
                component: () => import("@/views/login/categories/Categories.vue")
            },
            //订单分类页面
            {
                path: '/orders',
                name: 'orders',
                component: () => import("@/views/login/orders/Orders.vue")
            },
            //数据报表页面
            {
                path: '/reports',
                name: 'reports',
                component: () => import("@/views/login/reports/Reports.vue")
            },
        ]
    },

]