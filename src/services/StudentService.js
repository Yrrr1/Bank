import axios from "axios";

const API_URL = "http://localhost:8081/home/api/students";

export default {
  async getAll() {
    return await axios.get(API_URL);
  },

  async getById(studentId) {
    return await axios.get(`${API_URL}/${studentId}`);
  },

  async create(student) {
    return await axios.post(API_URL, student);
  },

  async update(studentId, studentData) {
    return await axios.put(`${API_URL}/${studentId}`, studentData);
  },

  async delete(studentId) {
    return await axios.delete(`${API_URL}/${studentId}`);
  },
};
