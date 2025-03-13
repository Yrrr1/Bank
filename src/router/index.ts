// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserLoginPage from "@/page/user/UserLoginPage.vue";
import UserRegisterPage from "@/page/user/UserRegisterPage.vue";
import GlobalHeader from "@/components/GlobalHeader.vue";
import StudentSource from "@/components/StudentSource.vue";
import StudentsManage from "@/page/aHumanManage/StudentsManage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "layout",
    component: GlobalHeader,
  },
  {
    path: "/user/login",
    name: "userLogin",
    component: UserLoginPage,
  },
  {
    path: "/user/register",
    name: "userRegister",
    component: UserRegisterPage,
  },
  {
    path: "/student",
    component: StudentSource,
    children: [
      {
        path: "manage", // 实际路径：/student/manage
        name: "studentManage",
        component: StudentsManage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 路由守卫示例
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 管理系统` : "管理系统";
  next();
});

export default router;
