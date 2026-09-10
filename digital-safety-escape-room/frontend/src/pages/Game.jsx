import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldAlert, 
  RotateCcw, 
  Home, 
  ArrowRight, 
  Key, 
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle,
  Volume2,
  VolumeX,
  Flame
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundEffects } from '../utils/soundEffects';
import ProgressBar from '../components/ProgressBar';
import Lives from '../components/Lives';
import ScoreCard from '../components/ScoreCard';
import ChallengeCard from '../components/ChallengeCard';
import Explanation from '../components/Explanation';

export default function Game({ navigate }) {
  const {
    session,
    currentChallenge,
    loading,
    submitting,
    feedback,
    submitAnswer,
    nextChallenge,
    restartGame
  } = useGame();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted());

  useEffect(() => {
    return soundEffects.subscribe((muted) => setIsMuted(muted));
  }, []);

  useEffect(() => {
    const warnBeforeLeaving = (event) => {
      if (session?.status === 'IN_PROGRESS') {
        event.preventDefault();
        event.returnValue = 'Your escape room is still in progress. Leaving now may interrupt your current challenge.';
      }
    };
    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [session?.status]);

  // Clear selected answer when new challenge loads
  useEffect(() => {
    if (!feedback) {
      setSelectedAnswer('');
    } else if (feedback.selectedAnswer) {
      setSelectedAnswer(feedback.selectedAnswer);
    }
  }, [currentChallenge, feedback]);

  // If no active session, prompt to return to dashboard
  if (!session || !currentChallenge) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          No Active Escape Room
        </h2>
        <p className="text-sm text-slate-500 max-w-sm">
          You are currently outside the room. Initiate a fresh escape challenge from your dashboard.
        </p>
        <button
          onClick={() => navigate('dashboard')}
          className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSelectAnswer = (opt) => {
    if (feedback) return; // Prevent changing after submission
    setSelectedAnswer(opt);
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || submitting) return;
    const res = await submitAnswer(selectedAnswer);
    if (res) {
      if (res.isCorrect) {
        soundEffects.playCorrect();
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore
        }
      } else {
        soundEffects.playWrong();
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
      }

      if (res.isGameOver || res.livesRemaining <= 0) {
        setTimeout(() => soundEffects.playGameOver(), 700);
      } else if (res.isCompleted) {
        setTimeout(() => soundEffects.playVictory(), 500);
      }
    }
  };

  const handleNext = async () => {
    soundEffects.playSelect();
    if (feedback?.isGameOver || session?.lives <= 0) {
      navigate('game-over');
      return;
    }

    if (feedback?.isCompleted || session?.status === 'COMPLETED') {
      navigate('result');
      return;
    }

    const res = await nextChallenge();
    if (res?.isFinished) {
      navigate('result');
    }
  };

  const toggleSound = () => {
    const next = soundEffects.toggleMute();
    setIsMuted(next);
    if (!next) {
      soundEffects.playSelect();
    }
  };

  const isAnswered = !!feedback;

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 space-y-6 transition-transform duration-200 ${
      isShaking ? 'animate-bounce text-rose-950' : ''
    }`}>
      {/* Escape Room Ambient Security Banner (Section 10) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border-l-4 border-emerald-400">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0">
            <Key className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-400 tracking-wider uppercase">
                SECURITY ALERT
              </span>
              <span className="text-slate-400 text-xs">• Emergency Lock Active</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              You are inside the Digital Safety Escape Room. Solve the cybersecurity challenges to unlock the exit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            className={`p-2 rounded-xl text-xs font-bold transition-colors border ${
              isMuted
                ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                : 'bg-emerald-950 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Top HUD: Score, Lives, Streak & Restart */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <ScoreCard
            score={session.score}
            difficulty={currentChallenge.difficulty}
          />
          <Lives count={session.lives} max={3} />
        </div>

        <div className="flex items-center gap-2">
          {session.correctAnswers > 1 && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black animate-pulse">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{session.correctAnswers} Streak!</span>
            </div>
          )}

          <button
            onClick={restartGame}
            title="Restart Challenge"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Restart Room
          </button>
        </div>
      </div>

      {/* Visual Escape Room Lock Progression Bar (Section 10 & 20) */}
      <ProgressBar
        currentIndex={session.currentChallengeIndex}
        total={session.totalChallenges || 4}
        categoryStages={session.categoryStages}
        currentCategory={currentChallenge.category}
      />

      {/* Interactive Challenge Scenario & Options (Sections 11, 12, 40) */}
      <ChallengeCard
        challenge={currentChallenge}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={handleSelectAnswer}
        onSubmit={handleSubmit}
        isSubmitted={isAnswered}
        submitting={submitting}
      />

      {/* Instant Feedback Module (Section 19) */}
      {isAnswered && (
        <Explanation
          feedback={feedback}
          onNext={handleNext}
          isGameOver={feedback.isGameOver || session.lives <= 0}
          isCompleted={feedback.isCompleted || session.status === 'COMPLETED'}
        />
      )}
    </div>
  );
}
