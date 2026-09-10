import api from './api';

export const adminService = {
  async getAnalytics() {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getUserPerformance(id) {
    const response = await api.get(`/admin/users/${id}/performance`);
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  async resetUserStats(id) {
    const response = await api.post(`/admin/users/${id}/reset`);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  async getChallenges() {
    const response = await api.get('/admin/challenges');
    return response.data;
  },

  async createChallenge(data) {
    const response = await api.post('/admin/challenges', data);
    return response.data;
  },

  async updateChallenge(id, data) {
    const response = await api.put(`/admin/challenges/${id}`, data);
    return response.data;
  },

  async toggleChallengeActive(id) {
    const response = await api.patch(`/admin/challenges/${id}/toggle`);
    return response.data;
  },

  async deleteChallenge(id) {
    const response = await api.delete(`/admin/challenges/${id}`);
    return response.data;
  },

  async generateAIChallenge(data) {
    const response = await api.post('/admin/generate-challenge', data);
    return response.data;
  }
};
