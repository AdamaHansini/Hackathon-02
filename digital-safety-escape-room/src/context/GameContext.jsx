import React, { createContext, useContext, useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import { useAuth } from './AuthContext';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { isAuthenticated, refreshUser } = useAuth();
  const [session, setSession] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeSessionAvailable, setActiveSessionAvailable] = useState(false);

  // Check if user has active session upon login
  useEffect(() => {
    if (isAuthenticated) {
      checkActiveSession();
    } else {
      setSession(null);
      setCurrentChallenge(null);
      setFeedback(null);
      setActiveSessionAvailable(false);
    }
  }, [isAuthenticated]);

  const checkActiveSession = async () => {
    try {
      const res = await gameService.getActiveSession();
      if (res.success && res.activeSession) {
        setActiveSessionAvailable(true);
        setSession(res.activeSession.session);
        setCurrentChallenge(res.activeSession.currentChallenge);
        setFeedback(res.activeSession.previousAnswer || null);
      } else {
        setActiveSessionAvailable(false);
        setSession(null);
        setCurrentChallenge(null);
        setFeedback(null);
      }
    } catch {
      setActiveSessionAvailable(false);
    }
  };

  const startNewGame = async (count = 4) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await gameService.startGame(count);
      if (res.success) {
        setSession(res.session);
        setCurrentChallenge(res.challenge);
        setActiveSessionAvailable(true);
        refreshUser();
        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  const resumeGame = async () => {
    setLoading(true);
    try {
      const res = await gameService.getActiveSession();
      if (res.success && res.activeSession) {
        setSession(res.activeSession.session);
        setCurrentChallenge(res.activeSession.currentChallenge);
        if (res.activeSession.previousAnswer) {
          setFeedback(res.activeSession.previousAnswer);
        } else {
          setFeedback(null);
        }
        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (selectedAnswer) => {
    if (!session || !currentChallenge) return;
    setSubmitting(true);
    try {
      const res = await gameService.submitAnswer(
        session._id,
        currentChallenge._id,
        selectedAnswer
      );

      if (res.success) {
        setFeedback(res);
        setSession(prev => ({
          ...prev,
          score: res.currentScore,
          lives: res.livesRemaining,
          status: res.status
        }));
        if (res.isGameOver || res.isCompleted) {
          refreshUser();
          setActiveSessionAvailable(false);
        }
        return res;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const nextChallenge = async () => {
    if (!session) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await gameService.nextChallenge(session._id);
      if (res.success) {
        if (res.isFinished) {
          setSession(prev => ({ ...prev, status: res.status }));
          refreshUser();
          setActiveSessionAvailable(false);
        } else {
          setSession(res.session);
          setCurrentChallenge(res.challenge);
        }
        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  const restartGame = async () => {
    if (!session) return startNewGame();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await gameService.restartGame(session._id);
      if (res.success) {
        setSession(res.session);
        setCurrentChallenge(res.challenge);
        setActiveSessionAvailable(true);
        refreshUser();
        return res;
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    setSession(null);
    setCurrentChallenge(null);
    setFeedback(null);
    setActiveSessionAvailable(false);
  };

  const value = {
    session,
    currentChallenge,
    loading,
    submitting,
    feedback,
    activeSessionAvailable,
    startNewGame,
    resumeGame,
    submitAnswer,
    nextChallenge,
    restartGame,
    clearSession,
    checkActiveSession
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
}
