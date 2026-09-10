import api from './api';

export const challengeService = {
  async getChallenges() {
    const response = await api.get('/challenges');
    return response.data;
  },

  async getChallengeById(id) {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },

  async createChallenge(data) {
    const response = await api.post('/challenges', data);
    return response.data;
  },

  async updateChallenge(id, data) {
    const response = await api.put(`/challenges/${id}`, data);
    return response.data;
  },

  async deleteChallenge(id) {
    const response = await api.delete(`/challenges/${id}`);
    return response.data;
  },

  async generateAiChallenge(category, difficulty) {
    const response = await api.post('/admin/generate-challenge', { category, difficulty });
    return response.data;
  }
};
