
import React, { useState, useEffect, useRef } from 'react';
import { Client } from '../types';
import { ICONS } from '../constants';
import { summarizeWiki } from '../geminiService';

interface ClientViewProps {
  client: Client;
  onUpdate: (updatedClient: Client) => void;
}

const ClientView: React.FC<ClientViewProps> = ({ client, onUpdate }) => {
  const [wikiContent, setWikiContent] = useState(client.wiki || '');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWikiContent(client.wiki || '');
    setAiSummary(null);
  }, [client.id]);

  const handleWikiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setWikiContent(newContent);
    onUpdate({ ...client, wiki: newContent });
  };

  const handleAiSummary = async () => {
    if (!wikiContent.trim()) return;
    setLoadingAi(true);
    const summary = await summarizeWiki(wikiContent);
    setAiSummary(summary || "Não foi possível gerar um resumo.");
    setLoadingAi(false);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...client, cover_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ ...client, logo: reader.result as string, logo_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fbfbfa] min-h-screen">
      {/* Header com Cover Editável */}
      <div className="relative group/cover">
        {client.cover_url ? (
          <img 
            src={client.cover_url} 
            className="h-64 w-full object-cover transition-opacity duration-300" 
            alt="Cover" 
          />
        ) : (
          <div className="h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full opacity-80" />
        )}
        
        {/* Overlay de Edição da Capa */}
        <div className="absolute top-4 right-8 opacity-0 group-hover/cover:opacity-100 transition-opacity">
          <button 
            onClick={() => coverInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur shadow-sm rounded-lg text-xs font-bold text-gray-700 hover:bg-white transition-all"
          >
            {ICONS.Image} Alterar Capa
          </button>
          <input 
            type="file" 
            ref={coverInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleCoverUpload}
          />
        </div>

        {/* Logo Editável */}
        <div className="absolute -bottom-16 left-12 md:left-24 flex items-end gap-6">
          <div className="relative group/logo">
            <div className="p-2 bg-white rounded-3xl shadow-xl border border-gray-100">
              <img 
                src={client.logo || client.logo_url} 
                alt={client.name} 
                className="w-32 h-32 rounded-2xl object-cover"
              />
            </div>
            
            {/* Botão de Troca de Logo */}
            <button 
              onClick={() => logoInputRef.current?.click()}
              className="absolute inset-0 m-2 bg-black/40 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity"
            >
              <div className="text-white">{ICONS.Camera}</div>
              <span className="text-white text-[10px] font-bold uppercase tracking-widest mt-1">Alterar</span>
            </button>
            <input 
              type="file" 
              ref={logoInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoUpload}
            />
          </div>

          <div className="mb-4">
            <input 
              type="text"
              value={client.name}
              onChange={(e) => onUpdate({ ...client, name: e.target.value })}
              className="text-4xl font-black text-gray-900 tracking-tight bg-transparent border-none outline-none focus:ring-0 w-full max-w-xl"
            />
            <div className="flex gap-2 mt-2">
              {client.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/80 backdrop-blur-md text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-24 px-6 md:px-12 pb-24 flex flex-col lg:flex-row gap-10">
        {/* Lado Esquerdo: A Wiki (O Documento) */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-[0_1px_3px_rgba(15,15,15,0.1),0_8px_24px_rgba(15,15,15,0.05)] border border-gray-100 overflow-hidden">
            {/* Toolbar da Wiki */}
            <div className="px-8 py-4 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {ICONS.File}
                </div>
                <span className="font-bold text-gray-800">Wikipedia do Cliente</span>
              </div>
              <button 
                onClick={handleAiSummary}
                disabled={loadingAi}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
              >
                {loadingAi ? 'IA Pensando...' : <>{ICONS.Sparkles} Resumo IA</>}
              </button>
            </div>

            {/* Conteúdo da Wiki */}
            <div className="p-10 md:p-16">
              {aiSummary && (
                <div className="mb-10 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-sm leading-relaxed text-indigo-900 animate-in fade-in slide-in-from-top-4 relative group">
                  <button onClick={() => setAiSummary(null)} className="absolute top-4 right-4 text-indigo-300 hover:text-indigo-600">{ICONS.Close}</button>
                  <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    {ICONS.Sparkles} Insight da Inteligência Artificial
                  </div>
                  {aiSummary}
                </div>
              )}

              <textarea 
                value={wikiContent}
                onChange={handleWikiChange}
                className="w-full min-h-[700px] outline-none text-gray-800 text-lg leading-relaxed resize-none font-normal placeholder:text-gray-200"
                placeholder="Comece a digitar o guia definitivo deste cliente..."
              />
            </div>
          </div>
        </div>

        {/* Lado Direito: Sidebar Operacional */}
        <div className="w-full lg:w-80 space-y-8">
          {/* Links Rápidos */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
              Atalhos Úteis
              <button className="text-indigo-600 hover:rotate-90 transition-transform">{ICONS.Plus}</button>
            </h3>
            <div className="space-y-3">
              {client.links?.map(link => (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-indigo-50 group transition-all"
                >
                  <div className="text-gray-300 group-hover:text-indigo-600">{ICONS.Link}</div>
                  <span className="text-xs font-bold text-gray-600 group-hover:text-indigo-900 truncate flex-1">{link.label}</span>
                  {ICONS.External}
                </a>
              ))}
              {client.drive_link && (
                <a href={client.drive_link} target="_blank" className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all">
                  <div className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-lg">🚀</div>
                  <span className="text-xs font-bold">Acessar Drive</span>
                </a>
              )}
            </div>
          </div>

          {/* Dados e Métricas */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Operação</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg uppercase tracking-wider">Ativo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">Faturamento</span>
                <span className="text-xs font-bold text-gray-800">Recorrente</span>
              </div>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-300 italic">Clique no nome para editar o título.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientView;
