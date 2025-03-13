<template>
  <div class="student-management">
    <a-button type="primary" @click="showModal">新增学生</a-button>

    <!-- 学生表格 -->
    <a-table
      :columns="columns"
      :data-source="students"
      :loading="loading"
      row-key="studentId"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <a @click="editStudent(record)">编辑</a>
            <a-popconfirm
              title="确认删除该学生吗？"
              @confirm="deleteStudent(record.studentId)"
            >
              <a style="color: red">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 新增/编辑模态框 -->
    <a-modal
      v-model:visible="visible"
      :title="formTitle"
      @ok="handleOk"
      @cancel="resetForm"
    >
      <a-form
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="学号" required>
          <a-input v-model:value="formState.studentId" :disabled="isEditing" />
        </a-form-item>
        <a-form-item label="姓名" required>
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="班级">
          <a-input v-model:value="formState.className" />
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number v-model:value="formState.age" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="formState.status">
            <a-select-option value="在读">在读</a-select-option>
            <a-select-option value="毕业">毕业</a-select-option>
            <a-select-option value="休学">休学</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系电话">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="formState.address" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import StudentService from "@/services/StudentService";
import { message } from "ant-design-vue";

// 表格列配置
const columns = [
  { title: "学号", dataIndex: "studentId" },
  { title: "姓名", dataIndex: "name" },
  { title: "班级", dataIndex: "className" },
  { title: "年龄", dataIndex: "age" },
  { title: "状态", dataIndex: "status" },
  { title: "操作", dataIndex: "operation" },
];

// 响应式数据
const students = ref([]);
const loading = ref(false);
const visible = ref(false);
const isEditing = ref(false);
const formTitle = ref("新增学生");

const formState = reactive({
  studentId: "",
  name: "",
  className: "",
  age: null,
  status: "在读",
  phone: "",
  address: "",
});

// 生命周期钩子
onMounted(async () => {
  await loadStudents();
});

// 加载学生数据
const loadStudents = async () => {
  try {
    loading.value = true;
    const response = await StudentService.getAll();
    students.value = response.data;
  } catch (error) {
    message.error("加载学生数据失败");
  } finally {
    loading.value = false;
  }
};

// 显示模态框
const showModal = () => {
  visible.value = true;
  isEditing.value = false;
  formTitle.value = "新增学生";
};

// 编辑学生
const editStudent = (record) => {
  Object.assign(formState, record);
  visible.value = true;
  isEditing.value = true;
  formTitle.value = "编辑学生";
};

// 提交表单
const handleOk = async () => {
  try {
    if (isEditing.value) {
      await StudentService.update(formState.studentId, formState);
      message.success("更新成功");
    } else {
      await StudentService.create(formState);
      message.success("创建成功");
    }
    await loadStudents();
    resetForm();
  } catch (error) {
    if (error.response?.status === 409) {
      message.error("学号已存在");
    } else {
      message.error("操作失败");
    }
  }
};

// 删除学生
const deleteStudent = async (studentId) => {
  try {
    await StudentService.delete(studentId);
    message.success("删除成功");
    await loadStudents();
  } catch (error) {
    message.error("删除失败");
  }
};

// 重置表单
const resetForm = () => {
  visible.value = false;
  Object.keys(formState).forEach((key) => {
    if (key !== "status") {
      formState[key] = key === "age" ? null : "";
    }
  });
  formState.status = "在读";
};
</script>

<style scoped>
.student-management {
  padding: 20px;
}
</style>
