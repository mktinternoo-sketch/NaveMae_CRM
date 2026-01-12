
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Profile, UserRole } from '../types';

const AdminView: React.FC = () => {
  const [members, setMembers] = useState<any[]>([
    { id: '1', name: 'Thiago Designer', email: 'thiago@flow.app', role: 'ADMIN', job_title: 'Head of Creative', status: 'active' },
    { id: '2', name: 'Juliana Silva', email: 'ju@flow.app', role: 'GESTOR', job_title: 'Account Manager', status: 'active' },
    { id: '3', name: 'Lucas Pedro', email: 'lucas@flow.app', role: 'MEMBRO', job_title: 'Motion Designer', status: 'active' },
  ]);

  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="flex-1 bg-white h-full overflow-y-auto p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão da Equipe</h1>
            <p className="text-gray-500 mt-1 text-sm">Controle permissões, cargos e acessos ao FLOWAPP.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            {ICONS.Plus} Convidar Colaborador
          </button>
        </header>

        <div className="bg-[#fbfbfa] rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Colaborador</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cargo</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Papel</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map(member => (
                <tr key={member.id} className="hover:bg-white transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{member.name}</p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-600 font-medium">{member.job_title}</span>
                  </td>
                  <td className="px-6 py-5">
                    <select 
                      defaultValue={member.role}
                      className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="GESTOR">GESTOR</option>
                      <option value="MEMBRO">MEMBRO</option>
                      <option value="VIEWER">VIEWER</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                      {ICONS.Trash}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-2">Convidar Membro</h2>
            <p className="text-gray-400 text-xs mb-8">O usuário receberá um convite por e-mail para acessar o FLOWAPP.</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">E-MAIL</label>
                <input type="email" placeholder="email@flow.app" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">PAPEL</label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm">
                    <option>MEMBRO</option>
                    <option>GESTOR</option>
                    <option>ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">CARGO</label>
                  <input type="text" placeholder="Ex: Designer" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600">Cancelar</button>
              <button className="bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold">Enviar Convite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
