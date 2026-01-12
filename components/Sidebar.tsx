
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
    { id: 'tasks', label: 'Tarefas CRM', icon: ICONS.Tasks },
    { id: 'tables', label: 'Tabelas', icon: ICONS.Tables },
    { id: 'team', label: 'Equipe', icon: ICONS.Clients },
  ];

  return (
    <div className="w-64 bg-[#fbfbfa] border-r border-[#ececec] h-full flex flex-col group">
      {/* Workspace Header / User Profile */}
      <div 
        onClick={() => setActiveSection('profile')}
        className="px-4 py-3 flex items-center justify-between hover:bg-[#efefed] cursor-pointer transition-colors border-b border-[#ececec]/50"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative">
            {currentUser?.photo ? (
                <img src={currentUser.photo} className="w-6 h-6 rounded-md object-cover border border-gray-100" alt="User" />
            ) : (
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {currentUser?.name[0] || 'A'}
                </div>
            )}
            {isUserBirthday && (
                <div className="absolute -top-1.5 -right-1.5 text-[10px] filter drop-shadow-sm transform -rotate-12">
                   🎉
                </div>
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-xs truncate flex items-center gap-1">
                {currentUser?.name || 'Agência Workspace'}
                {isUserBirthday && <span className="text-[8px] bg-red-400 text-white rounded-full px-1">🎂</span>}
            </span>
            <span className="text-[10px] text-gray-400 truncate">{currentUser?.email || 'Admin'}</span>
          </div>
        </div>
        <div className="text-gray-400">
          {ICONS.ChevronRight}
        </div>
      </div>

      {/* Main Nav */}
      <div className="mt-4 px-2 space-y-0.5">
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Geral
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeSection === item.id 
                ? 'bg-[#efefed] font-medium text-black' 
                : 'text-gray-600 hover:bg-[#efefed] hover:text-black'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Clients Section */}
      <div className="mt-8 px-2">
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider flex items-center justify-between">
          <span>Clientes (Wikipedia)</span>
          <button className="hover:bg-gray-200 p-0.5 rounded transition-colors text-gray-400">
            {ICONS.Plus}
          </button>
        </div>
        <div className="space-y-0.5 max-h-[35vh] overflow-y-auto">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => setActiveSection(`client-${client.id}`)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors text-left ${
                activeSection === `client-${client.id}`
                  ? 'bg-[#efefed] font-medium text-black'
                  : 'text-gray-600 hover:bg-[#efefed] hover:text-black'
              }`}
            >
              <div className="w-4 h-4 rounded-sm bg-gray-200 flex-shrink-0 flex items-center justify-center text-[8px]">
                {client.name[0]}
              </div>
              <span className="truncate">{client.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto p-4 border-t border-[#ececec]">
        <button 
          onClick={() => setActiveSection('profile')}
          className={`flex items-center gap-2 text-sm transition-colors w-full px-2 py-1.5 rounded-md ${
            activeSection === 'profile' ? 'bg-[#efefed] text-black font-medium' : 'text-gray-500 hover:text-black hover:bg-[#efefed]'
          }`}
        >
          {ICONS.Settings}
          Configurações
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
