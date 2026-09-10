import api from './api';

export const gameService = {
  async startGame(challengeCount = 4) {
    const response = await api.post('/games/start', { challengeCount });
    return response.data;
  },

  async getActiveSession() {
    const response = await api.get('/games/active');
    return response.data;
  },

  async getSession(sessionId) {
    const response = await api.get(`/games/${sessionId}`);
    return response.data;
  },

  async submitAnswer(sessionId, challengeId, selectedAnswer) {
    const response = await api.post(`/games/${sessionId}/answer`, {
      challengeId,
      selectedAnswer
    });
    return response.data;
  },

  async nextChallenge(sessionId) {
    const response = await api.post(`/games/${sessionId}/next`);
    return response.data;
  },

  async restartGame(sessionId) {
    const response = await api.post(`/games/${sessionId}/restart`);
    return response.data;
  },

  async getGameResult(sessionId) {
    const response = await api.get(`/results/${sessionId}`);
    return response.data;
  }
};
