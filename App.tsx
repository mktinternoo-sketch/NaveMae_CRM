
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
import AdminView from './components/AdminView';
import { INITIAL_CLIENTS, isBirthdayToday } from './constants';
import { Client, User } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  
  // Gerenciando clientes com estado para permitir edição
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('agency_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('agency_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('agency_clients', JSON.stringify(clients));
  }, [clients]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('agency_user', JSON.stringify(user));
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('agency_user', JSON.stringify(updatedUser));
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const isUserBirthday = isBirthdayToday(currentUser?.birthDate);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'tasks': return <TaskBoard />;
      case 'tables': return <CustomTables />;
      case 'team': return <TeamView />;
      case 'admin': return <AdminView />;
      case 'profile': return currentUser ? <ProfileView user={currentUser} onUpdate={handleUpdateProfile} /> : null;
      default:
        if (activeSection.startsWith('client-')) {
          const clientId = activeSection.split('-')[1];
          const client = clients.find(c => c.id === clientId);
          return client ? <ClientView client={client} onUpdate={handleUpdateClient} /> : <div className="p-12">Cliente não encontrado.</div>;
        }
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#fbfbfa] overflow-hidden relative text-[#37352f]">
      {isUserBirthday && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="absolute animate-float-balloon" style={{ 
                    left: `${Math.random() * 100}%`, 
                    bottom: '-10%', 
                    animationDelay: `${Math.random() * 5}s`,
                    fontSize: `${20 + Math.random() * 30}px`,
                    opacity: 0.7
                }}>
                    {['🎈', '🎉', '🎊', '✨', '🎂'][i % 5]}
                </div>
            ))}
            <style>{`
                @keyframes float-balloon {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-110vh) rotate(${Math.random() * 360}deg); opacity: 0; }
                }
                .animate-float-balloon { animation: float-balloon 8s linear infinite; }
            `}</style>
        </div>
      )}

      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} clients={clients} currentUser={currentUser} />
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
        <AIAssistant />
      </main>
    </div>
  );
};

export default App;
