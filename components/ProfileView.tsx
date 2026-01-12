
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { ICONS } from '../constants';

interface ProfileViewProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [photo, setPhoto] = useState(user.photo || '');
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate({ ...user, name, photo, birthDate });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 bg-white h-full overflow-y-auto p-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          {ICONS.Settings} Configurações de Perfil
        </h1>

        <div className="bg-[#fbfbfa] border border-gray-100 rounded-2xl p-8 mb-8">
          <div className="flex flex-col items-center mb-10">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <img 
                src={photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white mb-1">{ICONS.Camera}</div>
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">Upload Foto</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
              />
            </div>
            <p className="mt-4 text-gray-400 text-[11px] uppercase font-bold tracking-widest">Clique para carregar sua foto</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Seu Nome</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:outline-none text-lg"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">E-mail (Institucional)</label>
              <input 
                type="email" 
                disabled
                value={user.email}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                {ICONS.Cake} Data de Nascimento
              </label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:outline-none"
              />
              <p className="mt-1.5 text-[10px] text-gray-400">Usamos isso para comemorar seu aniversário com a equipe! 🎉</p>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button 
              onClick={handleSave}
              className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
            >
              {saved ? 'Perfil Atualizado! ✨' : 'Salvar Alterações'}
            </button>
            <p className="text-xs text-gray-400 italic">Membro desde {user.joinedAt}</p>
          </div>
        </div>

        <div className="p-6 border border-red-100 rounded-2xl bg-red-50/30">
          <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2">
            {ICONS.Trash} Zona Crítica
          </h3>
          <p className="text-sm text-red-500 mb-4 opacity-70">Sair da conta encerrará sua sessão atual no workspace da agência.</p>
          <button 
            onClick={() => {
                localStorage.removeItem('agency_user');
                window.location.reload();
            }}
            className="text-red-600 font-bold text-sm hover:underline"
          >
            Sair do AgencyOS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
