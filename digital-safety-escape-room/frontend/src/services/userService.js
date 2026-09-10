import api from './api';

export const userService = {
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async getHistory() {
    const response = await api.get('/users/history');
    return response.data;
  },

  async getStatistics() {
    const response = await api.get('/users/statistics');
    return response.data;
  },

  async getLeaderboard() {
    const response = await api.get('/leaderboard');
    return response.data;
  },

  async getAdminUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getAdminStatistics() {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  async getAdminChallenges() {
    const response = await api.get('/admin/challenges');
    return response.data;
  }
};
