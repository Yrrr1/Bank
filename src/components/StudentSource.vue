<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        @click="handleMenuClick"
      >
        <a-menu-item key="/">
          <pie-chart-outlined />
          <span>首页</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>人员管理</span>
            </span>
          </template>
          <a-menu-item key="/student/manage">学生管理</a-menu-item>
          <a-menu-item key="/teacher">教师管理</a-menu-item>
          <a-menu-item key="/admin">管理员</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <pie-chart-outlined />
              <span>可视化数据</span>
            </span>
          </template>
          <a-menu-item key="6">考勤情况</a-menu-item>
          <a-menu-item key="8">成绩分布</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header
        style="
          background: #fff;
          padding: 0 24px;
          height: 64px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        "
      >
        <a-dropdown trigger="hover" placement="bottomRight">
          <div v-if="userInfo" class="user-info">
            <a-avatar
              :src="avatarPath"
              :size="38"
              style="margin-right: 12px; background-color: #1890ff"
            />
            <div class="user-meta">
              <div class="username">
                {{ userInfo.username }}
                <down-outlined style="font-size: 12px; margin-left: 4px" />
              </div>
              <div class="role">{{ formattedRole }}</div>
            </div>
          </div>
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="profile">个人中心</a-menu-item>
              <a-menu-item key="settings">账号设置</a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout">退出登录</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>

      <a-layout-content style="margin: 0 16px">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  PieChartOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";

interface User {
  avatar: string;
  role: string;
  username: string;
}

const userInfo = ref<User | null>(null);

const formattedRole = computed(() => {
  if (!userInfo.value) return "";
  return (
    {
      ROLE_ADMIN: "管理员",
      ROLE_USER: "普通用户",
    }[userInfo.value.role] || userInfo.value.role
  );
});

const avatarPath = computed(() => {
  if (!userInfo.value) return "";
  return userInfo.value.avatar.startsWith("http")
    ? userInfo.value.avatar
    : `/images/${userInfo.value.avatar}`;
});

onMounted(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      userInfo.value = JSON.parse(userData);
    } catch (e) {
      console.error("用户数据解析失败:", e);
    }
  }
});

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const selectedKeys = ref<string[]>([]);

watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath];
  },
  { immediate: true }
);

const handleMenuClick = ({ key }: { key: string }) => {
  if (key === "logout") {
    // 退出登录逻辑
    localStorage.removeItem("user");
    router.push("/user/login");
  } else {
    router.push(key);
  }
};
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(0, 0, 0, 0.025);
}

.user-meta {
  line-height: 1.4;
}

.username {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  display: flex;
  align-items: center;
}

.role {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout-background {
  background: #141414;
}
</style>
