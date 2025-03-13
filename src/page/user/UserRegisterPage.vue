<template>
  <div class="register-container">
    <div class="banner">
      <h2>加入智慧校园</h2>
      <p>成为我们教育社区的一员，开启数字化学习新体验</p>
    </div>

    <div class="form-container">
      <div class="form-header">
        <h1>创建新账户</h1>
        <p>
          已有账户？
          <router-link to="/user/login" style="color: #2563eb"
            >立即登录</router-link
          >
        </p>
      </div>

      <form @submit.prevent="handleRegister">
        <!-- 用户名输入 -->
        <div class="form-group">
          <label>用户名</label>
          <input
            v-model="formData.username"
            type="text"
            class="input-field"
            placeholder="请输入用户名"
            required
          />
          <div v-if="errors.username" class="error-message">
            {{ errors.username }}
          </div>
        </div>

        <!-- 密码输入 -->
        <div class="form-group">
          <label>密码</label>
          <input
            v-model="formData.password"
            type="password"
            class="input-field"
            placeholder="至少8位字符"
            required
            minlength="8"
          />
          <div v-if="errors.password" class="error-message">
            {{ errors.password }}
          </div>
        </div>

        <!-- 确认密码 -->
        <div class="form-group">
          <label>确认密码</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            class="input-field"
            placeholder="请再次输入密码"
            required
          />
          <div v-if="errors.confirmPassword" class="error-message">
            {{ errors.confirmPassword }}
          </div>
        </div>

        <!-- 性别选择 -->
        <div class="form-group">
          <label>性别</label>
          <div class="gender-group">
            <input
              v-model="formData.gender"
              type="radio"
              name="gender"
              id="male"
              class="gender-radio"
              value="male"
              required
            />
            <label
              for="male"
              class="gender-label"
              :class="{ 'gender-active': formData.gender === 'male' }"
            >
              男
            </label>

            <input
              v-model="formData.gender"
              type="radio"
              name="gender"
              id="female"
              class="gender-radio"
              value="female"
            />
            <label
              for="female"
              class="gender-label"
              :class="{ 'gender-active': formData.gender === 'female' }"
            >
              女
            </label>
          </div>
        </div>

        <!-- 手机号 -->
        <div class="form-group">
          <label>手机号</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="input-field"
            placeholder="请输入手机号"
            pattern="[0-9]{11}"
            required
          />
          <div v-if="errors.phone" class="error-message">
            {{ errors.phone }}
          </div>
        </div>

        <!-- 邮箱 -->
        <div class="form-group">
          <label>电子邮箱</label>
          <input
            v-model="formData.email"
            type="email"
            class="input-field"
            placeholder="请输入邮箱地址"
            required
          />
          <div v-if="errors.email" class="error-message">
            {{ errors.email }}
          </div>
        </div>

        <!-- 注册按钮 -->
        <button
          type="submit"
          class="submit-btn"
          :disabled="loading"
          :style="{
            backgroundColor: loading ? '#93c5fd' : '#2563eb',
            cursor: loading ? 'not-allowed' : 'pointer',
          }"
        >
          {{ loading ? "注册中..." : "立即注册" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const API_BASE = "http://localhost:8081/home/api/users";

// 表单数据
const formData = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  gender: "",
  phone: "",
  email: "",
});

// 错误信息
const errors = reactive({
  username: "",
  password: "",
  confirmPassword: "",
  phone: "",
  email: "",
});

// 加载状态
const loading = ref(false);

// 表单验证
const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  // 用户名验证
  if (!formData.username.trim()) {
    errors.username = "用户名不能为空";
    isValid = false;
  }

  // 密码验证
  if (formData.password.length < 8) {
    errors.password = "密码至少需要8位";
    isValid = false;
  }

  // 确认密码
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "两次密码输入不一致";
    isValid = false;
  }

  // 手机号验证
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.phone = "请输入有效的手机号码";
    isValid = false;
  }

  // 邮箱验证
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    errors.email = "邮箱格式不正确";
    isValid = false;
  }

  return isValid;
};

// 提交注册
const handleRegister = async () => {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const response = await axios.post(`${API_BASE}/register`, {
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword, // 必须包含确认密码
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
    });

    if (response.data.code === 200) {
      alert("注册成功！");
      router.push("/user/login");
    } else {
      alert(response.data.msg || "注册失败");
    }
  } catch (error) {
    console.error("注册错误:", error);
    alert(error.response?.data?.msg || "网络请求失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 容器布局 */
.register-container {
  min-height: 100vh;
  display: flex;
  background: #f8fafc;
}

/* 左侧横幅 */
.banner {
  flex: 1;
  background: linear-gradient(rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.8)),
    url("https://images.unsplash.com/photo-1523580846011-d3a5bc25702b")
      center/cover;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

/* 表单容器 */
.form-container {
  width: 480px;
  padding: 4rem 3rem;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h1 {
  color: #1e293b;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

/* 表单元素 */
.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  color: #1e293b;
  font-size: 0.9rem;
}

.input-field {
  width: 100%;
  padding: 0.7rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.input-field:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* 性别选择 */
.gender-group {
  display: flex;
  gap: 1rem;
}

.gender-radio {
  display: none;
}

.gender-label {
  flex: 1;
  padding: 0.7rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.gender-active {
  border-color: #2563eb !important;
  background: rgba(37, 99, 235, 0.05);
}

/* 注册按钮 */
.submit-btn {
  width: 100%;
  padding: 0.9rem;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}

/* 错误提示 */
.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 4px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .banner {
    display: none;
  }

  .form-container {
    width: 100%;
    padding: 2rem 1.5rem;
  }
}
</style>
