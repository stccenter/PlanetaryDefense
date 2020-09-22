import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'home',
        component: () => import('@/views/home/index'),
        // meta: { title: 'Search', icon: 'search' },
        meta: { title: 'Search' },
      }
    ]
    // hidden: true
  },
  {
    path: '/referencelist',
    name: 'ReferenceList',
    component: () => import('@/views/reference-list'),
    hidden: true
  },
  {
    path: '/trend',
    component: Layout,
    name: 'Trend',
    meta: { title: 'Trend' },
    children: [
      {
        path: '/publication',
        name: 'Publication Statistic',
        component: () => import('@/views/overview/abst-num'),
        meta: { title: 'Publication' }
      },
      {
        path: 'abst-nation',
        name: 'Nation Statistic',
        component: () => import('@/views/overview/abst-nation'),
        meta: { title: 'Nation' }
      },
      {
        path: 'institute-analysis',
        name: 'Institute Statistic',
        component: () => import('@/views/overview/institute-analysis'),
        meta: { title: 'Institutions' }
      }
      // {
      //   path: 'keyword-analysis',
      //   name: 'Keyword Analysis',
      //   component: () => import('@/views/overview/keyword-analysis'),
      //   meta: { title: 'Keyword'}
      // }
    ]
  },
  {
    path: '/relationship',
    component: Layout,
    name: 'Relationship',
    meta: { title: 'Relationship' },
    children: [
      {
        path: 'nation',
        name: 'Nations',
        component: () => import('@/views/relationship/nation'),
        meta: { title: 'Nations' }
      },
      {
        path: 'institute',
        name: 'Institutes',
        component: () => import('@/views/relationship/institute'),
        meta: { title: 'Institutions' }
      },
      {
        path: 'author',
        name: 'Authors',
        component: () => import('@/views/relationship/author'),
        meta: { title: 'Authors' }
      }
    ]
  },
  {
    path: '/ranking',
    component: Layout,
    name: 'Ranking',
    meta: { title: 'Ranking' },
    children: [
      {
        path: 'keyword-wc',
        name: 'Keyword cloud',
        component: () => import('@/views/wordcloud/keyword-wc'),
        meta: { title: 'Keyword' }
      },
      {
        path: 'institute-wc',
        name: 'Institute',
        component: () => import('@/views/wordcloud/institute-wc'),
        meta: { title: 'Institutions' }
      }
    ]
  },
  {
    path: "/foundReference",
    component: Layout,
    children: [
      {
        path: "foundReference",
        name: "foundReference",
        component: () => import("@/views/found-reference"),
        meta: { title: "Found References" }
      }
    ]
  },
  {
    path: '/fullReference',
    component: Layout,
    // redirect: '/fullReference',
    children: [
      {
        path: 'fullReference',
        name: 'fullReference',
        component: () => import('@/views/full-reference'),
        meta: { title: 'All References' },
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
