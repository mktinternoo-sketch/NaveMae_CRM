
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import CustomTables from './components/CustomTables';
import ClientView from './components/ClientView';
import AIAssistant from './components/AIAssistant';
import AuthPage from './components/AuthPage';
import ProfileView from './components/ProfileView';
import TeamView from './components/TeamView';
import { INITIAL_CLIENTS, ICONS, isBirthdayToday } from './constants';
import { Client, User } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [clients] = useState<Client[]>(INITIAL_CLIENTS);

  // Carregar usuário do localStorage se existir
  useEffect(() => {
    const saved = localStorage.getItem('agency_user');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('agency_user', JSON.stringify(user));
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('agency_user', JSON.stringify(updatedUser));
  };

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const isUserBirthday = isBirthdayToday(currentUser?.birthDate);

  const renderContent = () => {
    if (activeSection === 'dashboard') return <Dashboard />;
    if (activeSection === 'tasks') return <TaskBoard />;
    if (activeSection === 'tables') return <CustomTables />;
    if (activeSection === 'team') return <TeamView />;
    if (activeSection === 'profile' && currentUser) return <ProfileView user={currentUser} onUpdate={handleUpdateProfile} />;
    
    if (activeSection.startsWith('client-')) {
      const clientId = activeSection.split('-')[1];
      const client = clients.find(c => c.id === clientId);
      return client ? <ClientView client={client} /> : <div className="p-12">Cliente não encontrado.</div>;
    }

    return <Dashboard />;
  };

  return (
    <div className="flex h-screen w-full bg-[#fbfbfa] overflow-hidden relative">
      {/* Balloon Celebration for Birthday Person */}
      {isUserBirthday && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute animate-float-balloon" 
                  style={{ 
                    left: `${Math.random() * 100}%`, 
                    bottom: '-10%', 
                    animationDelay: `${Math.random() * 5}s`,
                    fontSize: `${20 + Math.random() * 30}px`,
                    opacity: 0.7
                  }}
                >
                    {['🎈', '🎉', '🎊', '✨', '🎂'][i % 5]}
                </div>
            ))}
            <style>
                {`
                @keyframes float-balloon {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-110vh) rotate(${Math.random() * 360}deg); opacity: 0; }
                }
                .animate-float-balloon {
                    animation: float-balloon 8s linear infinite;
                }
                `}
            </style>
        </div>
      )}

      {/* Birthday Notification Banner */}
      {isUserBirthday && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white notion-shadow border-l-4 border-purple-600 px-6 py-4 rounded-xl z-[110] flex items-center gap-4 animate-in slide-in-from-top-12 duration-500">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                🎂
            </div>
            <div>
                <h4 className="font-black text-purple-900 leading-tight">Parabéns, {currentUser?.name}! 🥳</h4>
                <p className="text-xs text-purple-600/70 font-medium italic">A equipe AgencyOS deseja um dia maravilhoso!</p>
            </div>
            <button 
                onClick={(e) => {
                    const el = e.currentTarget.parentElement;
                    if(el) el.style.display = 'none';
                }}
                className="ml-4 text-gray-300 hover:text-gray-500 transition-colors"
            >
                {ICONS.Close}
            </button>
        </div>
      )}

      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        clients={clients}
        currentUser={currentUser}
      />
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
        <AIAssistant />
      </main>
    </div>
  );
};

export default App;
