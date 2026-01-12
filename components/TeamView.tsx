
import React, { useState } from 'react';
import { User } from '../types';
import { ICONS, isBirthdayToday } from '../constants';

const TeamView: React.FC = () => {
  const [members, setMembers] = useState<User[]>([
    { id: 'u1', name: 'Alice Silva', email: 'alice@agencia.com', role: 'Admin', joinedAt: '10/11/2023', photo: 'https://i.pravatar.cc/150?u=alice', birthDate: '1995-12-15' },
    { id: 'u2', name: 'Bob Junior', email: 'bob@agencia.com', role: 'Member', joinedAt: '12/11/2023', photo: 'https://i.pravatar.cc/150?u=bob', birthDate: '1992-05-20' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');

  const addMember = () => {
    if (!newEmail || !newName) return;
    const member: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      email: newEmail,
      role: 'Member',
      joinedAt: new Date().toLocaleDateString(),
      birthDate: newBirthDate,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newEmail}`
    };
    setMembers([...members, member]);
    setIsAdding(false);
    setNewEmail('');
    setNewName('');
    setNewBirthDate('');
  };

  return (
    <div className="flex-1 bg-white h-full overflow-y-auto p-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Equipe da Agência</h1>
          <p className="text-gray-500">Gerencie os colaboradores e acompanhe datas especiais.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
        >
          {ICONS.Plus} Convidar Colaborador
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full notion-shadow animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Novo Colaborador</h2>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-black">{ICONS.Close}</button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">NOME COMPLETO</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Pedro Alvares"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">E-MAIL CORPORATIVO</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="pedro@suaagencia.com"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1">
                  {ICONS.Cake} DATA DE NASCIMENTO
                </label>
                <input 
                  type="date" 
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-black">Cancelar</button>
              <button onClick={addMember} className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-black/10 active:scale-95 transition-all">
                Cadastrar Membro
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => {
          const birthdayToday = isBirthdayToday(member.birthDate);
          return (
            <div 
              key={member.id} 
              className={`p-6 border rounded-2xl transition-all group relative overflow-hidden ${
                birthdayToday 
                  ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-md ring-2 ring-purple-100' 
                  : 'border-gray-100 bg-[#fbfbfa] hover:border-gray-200'
              }`}
            >
              {birthdayToday && (
                <div className="absolute -top-1 -right-1 w-12 h-12 bg-purple-600 text-white flex items-center justify-center rounded-bl-2xl transform rotate-12 shadow-lg">
                  {ICONS.PartyPopper}
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                    <img 
                      src={member.photo} 
                      className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" 
                      alt={member.name} 
                    />
                    {birthdayToday && (
                      <div className="absolute -top-4 -left-2 text-2xl transform -rotate-12 animate-bounce">
                         🥳
                      </div>
                    )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm truncate flex items-center gap-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>
                  {member.role}
                </span>
                <div className="flex items-center gap-2">
                  {birthdayToday && (
                    <span className="text-[10px] font-bold text-purple-600 animate-pulse flex items-center gap-1">
                       {ICONS.Cake} HOJE!
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 font-medium">
                      {member.birthDate ? `${new Date(member.birthDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}` : '--'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamView;
