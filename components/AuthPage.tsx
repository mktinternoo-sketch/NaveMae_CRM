
import React, { useState } from 'react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulando criação de usuário
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email: email,
      role: 'Admin',
      joinedAt: new Date().toLocaleDateString(),
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl notion-shadow border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-2">
          {isLogin ? 'Bem-vindo ao AgencyOS' : 'Criar conta na agência'}
        </h1>
        <p className="text-gray-400 text-center text-sm mb-8">
          O workspace tudo-em-um para sua equipe.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">E-mail Institucional</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors mt-4 text-sm"
          >
            {isLogin ? 'Entrar no Workspace' : 'Começar agora'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            {isLogin ? 'Ainda não tem conta? Cadastre sua equipe' : 'Já possui conta? Fazer login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
