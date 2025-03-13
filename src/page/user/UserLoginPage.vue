<template>
  <div class="login-container">
    <div class="banner">
      <h2>欢迎回到智慧校园</h2>
      <p>连接知识，启迪未来</p>
    </div>

    <div class="form-container">
      <div class="form-header">
        <h1>用户登录</h1>
        <p>
          新用户？
          <router-link to="/user/register" style="color: #2563eb"
            >创建账户</router-link
          >
        </p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            v-model="loginData.account"
            type="text"
            class="input-field"
            placeholder="手机号/电子邮箱"
            required
          />
        </div>

        <div class="form-group">
          <input
            v-model="loginData.password"
            type="password"
            class="input-field"
            placeholder="输入密码"
            required
            minlength="8"
          />
        </div>

        <div class="captcha-group">
          <input
            v-model="loginData.captcha"
            type="text"
            class="input-field captcha-input"
            placeholder="输入验证码"
            required
          />
          <div class="captcha-img" @click="generateCaptcha">
            <span>{{ captchaCode }}</span>
          </div>
        </div>

        <div class="form-group">
          <button
            type="submit"
            class="submit-btn"
            :disabled="loading"
            :class="{ 'loading-state': loading }"
          >
            {{ loading ? "登录中..." : "立即登录" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const API_BASE = "http://localhost:8081/home/api/users";

// 响应式数据
const loginData = reactive({
  account: "",
  password: "",
  captcha: "",
});

const captchaCode = ref("");
const loading = ref(false);

// 生成验证码
const generateCaptcha = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaCode.value = code;
};

// 登录处理
const handleLogin = async () => {
  // 验证码校验
  if (loginData.captcha.toUpperCase() !== captchaCode.value) {
    alert("验证码错误");
    generateCaptcha();
    return;
  }

  loading.value = true;
  try {
    const response = await axios.post(`${API_BASE}/login`, {
      account: loginData.account,
      password: loginData.password,
    });

    if (response.data.code === 200) {
      // 角色判断跳转逻辑
      const role = response.data.user.role;
      switch (role) {
        case "ROLE_ADMIN":
          router.push("/student");
          break;
        case "ROLE_USER":
          router.push("/");
          break;
        default:
          router.push("/");
          console.warn("未识别角色:", role);
      }

      // 存储用户信息
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } else {
      generateCaptcha();
      alert(response.data.msg || "登录失败");
    }
  } catch (error) {
    console.error("登录错误:", error);
    generateCaptcha();
    if (error.response) {
      const status = error.response.status;
      alert(
        status === 401 ? "认证失败" : status === 403 ? "权限不足" : "服务异常"
      );
    } else {
      alert("网络连接失败");
    }
  } finally {
    loading.value = false;
  }
};

// 初始化生成验证码
onMounted(generateCaptcha);
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  background: #f8fafc;
}

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

.form-group {
  margin-bottom: 1.2rem;
}

.input-field {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #2563eb;
  outline: none;
}

.captcha-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.captcha-input {
  flex: 1;
}

.captcha-img {
  width: 120px;
  height: 48px;
  background: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  letter-spacing: 2px;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.submit-btn:hover {
  background: #1d4ed8;
}

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.loading-state {
  position: relative;
  overflow: hidden;
}

.loading-state::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  to {
    left: 100%;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .banner {
    display: none;
  }

  .form-container {
    width: 100%;
    padding: 2.5rem 1.5rem;
    box-shadow: none;
  }
}
</style>
