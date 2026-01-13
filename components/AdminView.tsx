
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { User } from '../types';

const AdminView: React.FC = () => {
  const [members, setMembers] = useState<User[]>(() => {
    const saved = localStorage.getItem('agency_members');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('agency_members', JSON.stringify(members));
  }, [members]);

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Tem certeza que deseja remover este colaborador? Ele perderá acesso ao workspace imediatamente.')) {
      setMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  return (
    <div className="flex-1 bg-white h-full overflow-y-auto p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#37352f]">Gestão da Equipe</h1>
            <p className="text-gray-400 mt-1 text-sm font-medium italic">Controle permissões, cargos e acessos ao sistema.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg shadow-black/5 active:scale-95"
          >
            {ICONS.Plus} Convidar Colaborador
          </button>
        </header>

        <div className="bg-[#fbfbfa] rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Papel</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-white transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-400 text-xs">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{member.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-black uppercase tracking-widest border border-gray-200">
                      {member.role || 'MEMBRO'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDeleteMember(member.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Excluir acesso do colaborador"
                    >
                      {ICONS.Trash}
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-gray-300 italic text-sm">
                    Nenhum colaborador cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold mb-2">Convidar Membro</h2>
            <p className="text-gray-400 text-xs mb-8">O usuário receberá um convite por e-mail para acessar o workspace.</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">NOME</label>
                <input type="text" placeholder="Nome completo" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">E-MAIL</label>
                <input type="email" placeholder="email@agencia.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm" />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Cancelar</button>
              <button className="bg-black text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/5">Enviar Convite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
