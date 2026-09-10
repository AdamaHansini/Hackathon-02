import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Instructions from './pages/Instructions';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Game from './pages/Game';
import GameOver from './pages/GameOver';
import Result from './pages/Result';
import History from './pages/History';
import Performance from './pages/Performance';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import { useGame } from './context/GameContext';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageChallenges from './pages/admin/ManageChallenges';
import ManageUsers from './pages/admin/ManageUsers';

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppShell />
      </GameProvider>
    </AuthProvider>
  );
}

function AppShell() {
  const { session } = useGame();
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  const navigate = (route) => {
    if (session?.status === 'IN_PROGRESS' && route !== 'game') {
      window.alert('Your escape room is still in progress. Leaving now may interrupt your current challenge.');
      if (window.location.hash !== '#game') window.location.hash = 'game';
      setCurrentRoute('game');
      return;
    }
    window.location.hash = route;
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      if (session?.status === 'IN_PROGRESS' && hash !== 'game') {
        window.alert('Your escape room is still in progress. Leaving now may interrupt your current challenge.');
        window.location.hash = 'game';
        setCurrentRoute('game');
        return;
      }
      setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [session?.status]);

  const renderRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'instructions':
        return <Instructions navigate={navigate} />;
      case 'login':
        return <Login navigate={navigate} />;
      case 'register':
        return <Register navigate={navigate} />;
      case 'dashboard':
        return (
          <ProtectedRoute navigate={navigate}>
            <Dashboard navigate={navigate} />
          </ProtectedRoute>
        );
      case 'game':
        return (
          <ProtectedRoute navigate={navigate}>
            <Game navigate={navigate} />
          </ProtectedRoute>
        );
      case 'game-over':
        return (
          <ProtectedRoute navigate={navigate}>
            <GameOver navigate={navigate} />
          </ProtectedRoute>
        );
      case 'result':
        return (
          <ProtectedRoute navigate={navigate}>
            <Result navigate={navigate} />
          </ProtectedRoute>
        );
      case 'history':
        return (
          <ProtectedRoute navigate={navigate}>
            <History navigate={navigate} />
          </ProtectedRoute>
        );
      case 'performance':
        return (
          <ProtectedRoute navigate={navigate}>
            <Performance navigate={navigate} />
          </ProtectedRoute>
        );
      case 'leaderboard':
        return <Leaderboard navigate={navigate} />;
      case 'profile':
        return (
          <ProtectedRoute navigate={navigate}>
            <Profile navigate={navigate} />
          </ProtectedRoute>
        );
      case 'admin':
        return (
          <ProtectedRoute adminOnly navigate={navigate}>
            <AdminDashboard navigate={navigate} />
          </ProtectedRoute>
        );
      case 'admin-challenges':
        return (
          <ProtectedRoute adminOnly navigate={navigate}>
            <ManageChallenges navigate={navigate} />
          </ProtectedRoute>
        );
      case 'admin-users':
        return (
          <ProtectedRoute adminOnly navigate={navigate}>
            <ManageUsers navigate={navigate} />
          </ProtectedRoute>
        );
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-slate-900 antialiased">
      <Navbar currentRoute={currentRoute} navigate={navigate} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderRoute()}
      </main>
      <Footer navigate={navigate} currentRoute={currentRoute} />
    </div>
  );
}
