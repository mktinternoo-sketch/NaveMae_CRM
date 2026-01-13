
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import ClientView from './components/ClientView';
import AIAssistant from './components/AIAssistant';
import AuthPage from './components/AuthPage';
import ProfileView from './components/ProfileView';
import TeamView from './components/TeamView';
import AdminView from './components/AdminView';
import { INITIAL_CLIENTS, INITIAL_TASKS, isBirthdayToday, ICONS } from './constants';
import { Client, User, Task } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  // Modais
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('agency_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('agency_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [members, setMembers] = useState<User[]>(() => {
    const saved = localStorage.getItem('agency_members');
    return saved ? JSON.parse(saved) : [
      { id: 'u1', name: 'Alice Silva', email: 'alice@agencia.com', role: 'Admin', joinedAt: '10/11/2023', photo: 'https://i.pravatar.cc/150?u=alice', birthDate: '1995-12-15' },
      { id: 'u2', name: 'Bob Junior', email: 'bob@agencia.com', role: 'Member', joinedAt: '12/11/2023', photo: 'https://i.pravatar.cc/150?u=bob', birthDate: '1992-05-20' },
    ];
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

  useEffect(() => {
    localStorage.setItem('agency_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('agency_members', JSON.stringify(members));
  }, [members]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('agency_user', JSON.stringify(user));
    if (!members.find(m => m.email === user.email)) {
      setMembers(prev => [...prev, user]);
    }
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setMembers(prev => prev.map(m => m.id === updatedUser.id ? updatedUser : m));
    localStorage.setItem('agency_user', JSON.stringify(updatedUser));
  };

  const handleUpdateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta marca? Todos os dados vinculados serão perdidos.')) {
      setClients(prev => prev.filter(c => c.id !== clientId));
      setActiveSection('dashboard');
    }
  };

  const handleCreateClient = () => {
    if (!newClientName.trim()) return;
    
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: newClientName,
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${newClientName}`,
      cover_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
      description: 'Nova marca registrada no workspace.',
      wiki: '# Wiki da Marca\n\nComece a documentar as diretrizes e informações importantes desta marca aqui.',
      links: [],
      tags: ['Nova Marca']
    };

    setClients(prev => [...prev, newClient]);
    setNewClientName('');
    setIsAddClientModalOpen(false);
    setActiveSection(`client-${newClient.id}`);
  };

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const isUserBirthday = isBirthdayToday(currentUser?.birthDate);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard tasks={tasks} members={members} />;
      case 'tasks': return <TaskBoard currentUser={currentUser} clients={clients} tasks={tasks} setTasks={setTasks} />;
      case 'team': return <TeamView members={members} setMembers={setMembers} />;
      case 'admin': return <AdminView />;
      case 'profile': return currentUser ? <ProfileView user={currentUser} onUpdate={handleUpdateProfile} /> : null;
      default:
        if (activeSection.startsWith('client-')) {
          const clientId = activeSection.split('-')[1];
          const client = clients.find(c => c.id === clientId);
          return client ? (
            <ClientView 
              client={client} 
              onUpdate={handleUpdateClient} 
              onDelete={handleDeleteClient}
              currentUser={currentUser}
            />
          ) : (
            <div className="p-12">Cliente não encontrado.</div>
          );
        }
        return <Dashboard tasks={tasks} members={members} />;
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

      <div 
        className={`transition-all duration-300 ease-in-out h-full border-r border-[#ececec] bg-[#fbfbfa] overflow-hidden flex-shrink-0 ${
          isSidebarVisible ? 'w-64' : 'w-0'
        }`}
      >
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          clients={clients} 
          currentUser={currentUser} 
          onCollapse={() => setIsSidebarVisible(false)}
          onAddClientClick={() => setIsAddClientModalOpen(true)}
        />
      </div>

      <main className="flex-1 overflow-hidden relative flex flex-col h-full bg-[#fbfbfa]">
        {!isSidebarVisible && (
          <button 
            onClick={() => setIsSidebarVisible(true)}
            className="absolute top-4 left-4 z-40 p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group shadow-sm bg-white/80 backdrop-blur"
          >
            {ICONS.Menu}
          </button>
        )}
        
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
        <AIAssistant />
      </main>

      {/* Modal de Adicionar Marca */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[150] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600">
                {ICONS.Clients}
                <span className="text-xs font-black uppercase tracking-widest">Nova Marca / Cliente</span>
              </div>
              <button onClick={() => setIsAddClientModalOpen(false)} className="text-gray-300 hover:text-gray-600">
                {ICONS.Close}
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">NOME DA MARCA</label>
                <input 
                  type="text"
                  autoFocus
                  placeholder="Ex: Apple Inc."
                  value={newClientName}
                  onChange={e => setNewClientName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleCreateClient()}
                  className="w-full text-xl font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 italic leading-relaxed">
                Ao criar uma nova marca, uma Wiki exclusiva e uma área de recursos serão geradas automaticamente.
              </p>
            </div>

            <div className="p-8 pt-0 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddClientModalOpen(false)}
                className="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateClient}
                disabled={!newClientName.trim()}
                className="px-8 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/5 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                Criar Marca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
