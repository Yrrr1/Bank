<template>
  <a-layout class="layout">
    <!-- Header部分 -->
    <a-layout-header class="custom-header">
      <a-row :wrap="false" class="header-row">
        <a-col flex="200px">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
            <div class="title">E-one校园</div>
          </div>
        </a-col>
        <a-col flex="auto">
          <a-menu
            v-model:selectedKeys="current"
            mode="horizontal"
            :items="items"
            theme="dark"
            :style="{ lineHeight: '64px', flex: 1 }"
            @click="doMenuClick"
          />
        </a-col>
        <a-col flex="120px" class="login-col">
          <div class="user-login-status">
            <a-button type="primary" href="/user/login" ghost>登录</a-button>
          </div>
        </a-col>
      </a-row>
    </a-layout-header>

    <!-- Content部分 -->
    <a-layout-content>
      <!-- 轮播图 -->
      <a-carousel autoplay :autoplay-speed="5000" effect="fade">
        <div v-for="(image, index) in carouselImages" :key="index">
          <img :src="image.url" :alt="image.alt" class="carousel-image" />
          <div class="carousel-caption">
            <h2>{{ image.title }}</h2>
            <p>{{ image.description }}</p>
          </div>
        </div>
      </a-carousel>

      <!-- 卡片区域 -->
      <div class="card-container">
        <a-row :gutter="16" justify="center">
          <a-col
            :xs="24"
            :sm="12"
            :md="8"
            v-for="card in cards"
            :key="card.title"
          >
            <a-card
              hoverable
              class="custom-card"
              @click="router.push(card.path)"
            >
              <template #cover>
                <img :src="card.image" alt="cover" />
              </template>
              <a-card-meta
                :title="card.title"
                :description="card.description"
              />
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-layout-content>

    <!-- Footer部分 -->
    <a-layout-footer style="text-align: center; padding: 24px">
      Design ©2025 Created by Yrrrr1
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import { h, ref } from "vue";
import { HomeOutlined, CrownOutlined } from "@ant-design/icons-vue";
import { MenuProps } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 路由处理逻辑
const doMenuClick = ({ key }: { key: string }) => {
  router.push({ path: key });
};

// 自动同步路由状态
const current = ref<string[]>([route.path]);
router.afterEach((to) => {
  current.value = [to.path];
});

// 菜单项配置
const items = ref<MenuProps["items"]>([
  {
    key: "/",
    icon: () => h(HomeOutlined),
    label: "主页",
    title: "主页",
  },
  {
    key: "/user/login",
    label: "用户登录",
    title: "用户登录",
  },
  {
    key: "/user/register",
    label: "用户注册",
    title: "用户注册",
  },
  {
    key: "/student",
    icon: () => h(CrownOutlined),
    label: "学生管理",
    title: "学生管理",
  },
  {
    key: "others",
    label: h(
      "a",
      { href: "https://bilibili.com", target: "_blank" },
      "B站导航"
    ),
    title: "B站导航",
  },
]);

// 轮播图数据
const carouselImages = ref([
  {
    url: new URL("../assets/1.jpg", import.meta.url).href,
    alt: "校园风光1",
    title: "欢迎来到易网校园",
    description: "探索智慧校园生活",
  },
  {
    url: new URL("../assets/2.jpg", import.meta.url).href,
    alt: "校园风光2",
    title: "优质教育资源",
    description: "连接知识与未来",
  },
  {
    url: new URL("../assets/3.jpg", import.meta.url).href,
    alt: "校园活动",
    title: "多彩校园生活",
    description: "发现你的无限可能",
  },
]);

// 卡片数据
const cards = ref([
  {
    title: "学生管理",
    description: "学生信息管理系统",
    path: "/student",
    image: new URL("../assets/1.jpg", import.meta.url).href,
  },
  {
    title: "课程查询",
    description: "课程信息查询系统",
    path: "/course",
    image: new URL("../assets/1.jpg", import.meta.url).href,
  },
  {
    title: "校园活动",
    description: "最新活动资讯",
    path: "/activity",
    image: new URL("../assets/1.jpg", import.meta.url).href,
  },
]);
</script>

<style scoped>
/* Header样式 */
.custom-header {
  padding: 0 20px;
  background: #001529 !important;
  position: fixed;
  width: 100%;
  z-index: 1;
}

.header-row {
  height: 64px;
  max-width: 1400px;
  margin: 0 auto;
}

.title-bar {
  display: flex;
  align-items: center;
  height: 100%;
}

.title {
  color: white !important;
  font-size: 20px;
  margin-left: 16px;
}

.logo {
  height: 40px;
}

.login-col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.user-login-status {
  margin-left: auto;
}

/* 轮播图样式 */
:deep(.ant-carousel) {
  height: 400px; /* 修改后的高度 */
}

.carousel-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  vertical-align: middle;
}

.carousel-caption {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  max-width: 80%;
}

.carousel-caption h2 {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.carousel-caption p {
  font-size: 1.2rem;
}

/* 卡片区域样式 */
.card-container {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.custom-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.custom-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.ant-card-cover) {
  height: 200px;
  overflow: hidden;
}

:deep(.ant-card-cover img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .carousel-caption h2 {
    font-size: 1.5rem;
  }

  .carousel-caption p {
    font-size: 1rem;
  }

  .card-container {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .carousel-caption {
    bottom: 10%;
  }
}
</style>
