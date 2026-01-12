
import React from 'react';
import { ICONS, isBirthdayToday } from '../constants';
import { User } from '../types';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  clients: any[];
  currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, clients, currentUser }) => {
  const isUserBirthday = isBirthdayToday(currentUser?.birthDate);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ICONS.Dashboard },
    { id: 'tasks', label: 'Produção', icon: ICONS.Tasks },
    { id: 'tables', label: 'Tabelas', icon: ICONS.Tables },
    { id: 'team', label: 'Equipe', icon: ICONS.Clients },
  ];

  return (
    <div className="w-64 bg-[#fbfbfa] border-r border-[#ececec] h-full flex flex-col">
      <div 
        onClick={() => setActiveSection('profile')}
        className="px-5 py-4 flex items-center justify-between hover:bg-[#efefed] cursor-pointer transition-colors border-b border-[#ececec]/30"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative">
            {currentUser?.photo ? (
                <img src={currentUser.photo} className="w-7 h-7 rounded-lg object-cover border border-gray-100 shadow-sm" alt="User" />
            ) : (
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                {currentUser?.name[0] || 'A'}
                </div>
            )}
            {isUserBirthday && <div className="absolute -top-1.5 -right-1.5 text-[10px]">🎉</div>}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-[13px] text-gray-800 truncate">{currentUser?.name || 'Flow Workspace'}</span>
            <span className="text-[10px] text-gray-400 truncate tracking-tight">{currentUser?.email}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 px-3 space-y-0.5">
        <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operação</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all ${
              activeSection === item.id 
                ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm shadow-indigo-100' 
                : 'text-gray-500 hover:bg-[#efefed] hover:text-gray-800'
            }`}
          >
            <span className={activeSection === item.id ? 'text-indigo-600' : 'text-gray-400'}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8 px-3">
        <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-between">
          <span>Marcas</span>
          <button className="hover:text-indigo-600 transition-colors">{ICONS.Plus}</button>
        </div>
        <div className="space-y-0.5 max-h-[40vh] overflow-y-auto">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => setActiveSection(`client-${client.id}`)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-left transition-all ${
                activeSection === `client-${client.id}`
                  ? 'bg-indigo-50 text-indigo-600 font-bold'
                  : 'text-gray-500 hover:bg-[#efefed]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-indigo-200" />
              <span className="truncate">{client.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 space-y-1">
        {currentUser?.role === 'Admin' && (
          <button 
            onClick={() => setActiveSection('admin')}
            className={`flex items-center gap-3 text-[13px] w-full px-3 py-2 rounded-xl transition-all ${
              activeSection === 'admin' ? 'bg-black text-white font-bold' : 'text-gray-500 hover:bg-[#efefed]'
            }`}
          >
            {ICONS.Settings} Admin
          </button>
        )}
        <button 
          onClick={() => setActiveSection('profile')}
          className={`flex items-center gap-3 text-[13px] w-full px-3 py-2 rounded-xl transition-all ${
            activeSection === 'profile' ? 'bg-[#efefed] text-gray-800 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-[#efefed]'
          }`}
        >
          {ICONS.Sparkles} Preferências
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
