// src/api/service.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 通过代理转发
  timeout: 5000,
});

export default {
  // 用户注册
  async register(userData) {
    return api.post("/users/register", userData);
  },

  // 获取用户列表
  async getUsers() {
    return api.get("/users");
  },
};
