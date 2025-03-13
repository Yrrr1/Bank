<template>
  <div class="user-management">
    <a-button
      type="primary"
      @click="showModal(null)"
      style="margin-bottom: 20px"
    >
      <template #icon><PlusOutlined /></template>
      新增用户
    </a-button>

    <a-table
      :dataSource="users"
      :columns="columns"
      :rowKey="(record) => record.id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'gender'">
          {{ genderMap[record.gender] || "未知" }}
        </template>
        <template v-if="column.dataIndex === 'avatar'">
          <a-image :width="40" :src="record.avatar" />
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <a-button type="link" @click="showModal(record)">编辑</a-button>
            <a-button type="link" danger @click="handleDelete(record.id)"
              >删除</a-button
            >
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:visible="visible"
      :title="currentUser ? '编辑用户' : '新增用户'"
      @ok="handleSubmit"
      :confirmLoading="confirmLoading"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="用户名" name="username" :rules="rules.username">
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="currentUser ? rules.passwordEdit : rules.password"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item label="性别" name="gender">
          <a-select v-model:value="formState.gender">
            <a-select-option value="male">男</a-select-option>
            <a-select-option value="female">女</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="手机号" name="phone" :rules="rules.phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>

        <a-form-item label="邮箱" name="email" :rules="rules.email">
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item label="头像">
          <a-upload
            v-model:fileList="fileList"
            list-type="picture-card"
            :before-upload="beforeUpload"
            @change="handleUploadChange"
            :customRequest="dummyUpload"
          >
            <div v-if="formState.avatar">
              <img
                :src="formState.avatar"
                alt="avatar"
                style="width: 100%; height: 100%; object-fit: cover"
              />
            </div>
            <div v-else>
              <PlusOutlined />
              <div style="margin-top: 8px">上传头像</div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  Modal,
  message,
  Button as AButton,
  Table as ATable,
  Image as AImage,
  Upload as AUpload,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  InputPassword as AInputPassword,
  Select as ASelect,
  Space as ASpace,
  SelectOption as ASelectOption,
} from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";

// 模拟数据
const mockUsers = [
  {
    id: 1,
    username: "user1",
    password: "123456",
    gender: "male",
    phone: "13800138000",
    email: "user1@example.com",
    avatar: "default-avatar.png",
    createTime: "2023-08-01 10:00:00",
  },
];

const users = ref([...mockUsers]);
const visible = ref(false);
const confirmLoading = ref(false);
const formRef = ref();
const currentUser = ref(null);
const fileList = ref([]);

const formState = reactive({
  username: "",
  password: "",
  gender: undefined,
  phone: "",
  email: "",
  avatar: "",
});

const genderMap = {
  male: "男",
  female: "女",
};

const rules = {
  username: [
    { required: true, message: "请输入用户名" },
    { min: 4, max: 16, message: "用户名长度4-16位" },
  ],
  password: [
    { required: true, message: "请输入密码" },
    { min: 6, max: 18, message: "密码长度6-18位" },
  ],
  passwordEdit: [
    // 编辑时的密码规则
    { min: 6, max: 18, message: "密码长度6-18位" },
  ],
  email: [{ type: "email", message: "请输入有效的邮箱地址" }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号" }],
};

const columns = [
  { title: "ID", dataIndex: "id" },
  { title: "用户名", dataIndex: "username" },
  { title: "性别", dataIndex: "gender" },
  { title: "手机号", dataIndex: "phone" },
  { title: "邮箱", dataIndex: "email" },
  { title: "头像", dataIndex: "avatar" },
  { title: "创建时间", dataIndex: "createTime" },
  { title: "操作", dataIndex: "operation" },
];

const showModal = (record) => {
  currentUser.value = record;
  if (record) {
    Object.assign(formState, {
      ...record,
      password: "", // 密码不显示原值
    });
  } else {
    formRef.value?.resetFields();
    formState.avatar = ""; // 重置头像
  }
  visible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    confirmLoading.value = true;

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (currentUser.value) {
      // 更新用户（保留创建时间）
      const updatedUser = {
        ...currentUser.value,
        ...formState,
        createTime: currentUser.value.createTime,
      };
      const index = users.value.findIndex((u) => u.id === currentUser.value.id);
      users.value.splice(index, 1, updatedUser);
    } else {
      // 新增用户
      users.value.push({
        ...formState,
        id: Date.now(), // 更可靠的ID生成
        createTime: new Date().toLocaleString(),
      });
    }

    message.success("操作成功");
    visible.value = false;
    formRef.value.resetFields();
  } catch (error) {
    console.error("验证失败:", error);
  } finally {
    confirmLoading.value = false;
  }
};

const handleDelete = (id) => {
  Modal.confirm({
    title: "确认删除",
    content: "确定要删除该用户吗？",
    okText: "确认",
    cancelText: "取消",
    onOk: async () => {
      users.value = users.value.filter((u) => u.id !== id);
      message.success("删除成功");
    },
  });
};

const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    message.error("只能上传图片文件!");
  }
  return isImage;
};

// 模拟上传请求
const dummyUpload = async ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("success");
    formState.avatar = URL.createObjectURL(file);
  }, 1000);
};

const handleUploadChange = ({ file }) => {
  if (file.status === "done") {
    message.success("头像上传成功");
  } else if (file.status === "error") {
    message.error("头像上传失败");
  }
};

onMounted(() => {
  // 模拟加载数据
  users.value = [...mockUsers];
});
</script>

<style scoped>
.user-management {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-upload-select-picture-card) {
  width: 128px;
  height: 128px;
}
</style>
