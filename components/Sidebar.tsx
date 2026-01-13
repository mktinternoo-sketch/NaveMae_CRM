
import React, { useState } from 'react';
import { ICONS, isBirthdayToday } from '../constants';
import { User } from '../types';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  clients: any[];
  currentUser: User | null;
  onCollapse: () => void;
  onAddClientClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  clients, 
  currentUser, 
  onCollapse,
  onAddClientClick 
}) => {
  const [clientSearch, setClientSearch] = useState('');
  const isUserBirthday = isBirthdayToday(currentUser?.birthDate);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ICONS.Dashboard },
    { id: 'tasks', label: 'Produção', icon: ICONS.Tasks },
    { id: 'team', label: 'Equipe', icon: ICONS.Clients },
  ];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div className="w-64 bg-[#fbfbfa] h-full flex flex-col select-none">
      {/* Header com User Info e Toggle Button */}
      <div className="px-5 py-4 flex items-center justify-between group">
        <div 
          onClick={() => setActiveSection('profile')}
          className="flex items-center gap-3 overflow-hidden cursor-pointer flex-1"
        >
          <div className="relative flex-shrink-0">
            {currentUser?.photo ? (
                <img src={currentUser.photo} className="w-7 h-7 rounded-lg object-cover border border-gray-100 shadow-sm" alt="User" />
            ) : (
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black">
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

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCollapse();
          }}
          className="p-1 text-gray-300 hover:text-gray-600 hover:bg-[#efefed] rounded-md transition-all opacity-0 group-hover:opacity-100 ml-2"
          title="Esconder menu lateral"
        >
          {ICONS.ChevronLeft}
        </button>
      </div>

      <div className="mt-6 px-3 space-y-0.5 overflow-y-auto flex-1 custom-scrollbar">
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
            <span className="truncate">{item.label}</span>
          </button>
        ))}

        <div className="mt-8">
          <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-between">
            <span>Marcas</span>
            <button 
              onClick={onAddClientClick}
              className="hover:text-indigo-600 transition-colors p-1 hover:bg-[#efefed] rounded-md"
            >
              {ICONS.Plus}
            </button>
          </div>
          
          {/* Pesquisa de Marcas */}
          <div className="px-3 mb-2">
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300">
                {ICONS.Search}
              </div>
              <input 
                type="text"
                placeholder="Pesquisar marcas..."
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-gray-200 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-0.5">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => setActiveSection(`client-${client.id}`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] text-left transition-all ${
                  activeSection === `client-${client.id}`
                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                    : 'text-gray-500 hover:bg-[#efefed]'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-indigo-200 flex-shrink-0" />
                <span className="truncate">{client.name}</span>
              </button>
            ))}
            {filteredClients.length === 0 && clientSearch && (
              <div className="px-3 py-4 text-center text-[10px] text-gray-400 italic">
                Nenhuma marca encontrada.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-1 mt-auto border-t border-[#ececec]/30">
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
