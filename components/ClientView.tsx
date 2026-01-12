
import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { ICONS } from '../constants';
import { summarizeWiki } from '../geminiService';

interface ClientViewProps {
  client: Client;
}

const ClientView: React.FC<ClientViewProps> = ({ client }) => {
  const [wikiContent, setWikiContent] = useState(client.wiki);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setWikiContent(client.wiki);
    setAiSummary(null);
  }, [client]);

  const handleAiSummary = async () => {
    setLoadingAi(true);
    const summary = await summarizeWiki(wikiContent);
    setAiSummary(summary || "Não foi possível gerar um resumo.");
    setLoadingAi(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white min-h-screen">
      {/* Header Cover Image */}
      <div className="h-48 bg-gradient-to-r from-slate-100 to-slate-200 w-full relative group">
        <div className="absolute -bottom-12 left-24 p-1 bg-white rounded-xl shadow-lg border border-gray-100">
          <img 
            src={client.logo} 
            alt={client.name} 
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-20 px-12 pb-24">
        <h1 className="text-4xl font-bold mb-4">{client.name}</h1>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {client.tags.map(tag => (
            <span key={tag} className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Main Wiki Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {ICONS.File}
                Wikipedia do Cliente
              </h2>
              <button 
                onClick={handleAiSummary}
                disabled={loadingAi}
                className="text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 flex items-center gap-1 disabled:opacity-50"
              >
                {loadingAi ? 'Resumindo...' : 'Resumir com AI ✨'}
              </button>
            </div>

            {aiSummary && (
              <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-lg text-sm italic text-gray-700">
                <p className="font-semibold text-purple-800 mb-1 flex items-center gap-1">✨ Resumo AI:</p>
                {aiSummary}
              </div>
            )}

            <textarea 
              value={wikiContent}
              onChange={(e) => setWikiContent(e.target.value)}
              placeholder="Comece a escrever a documentação do cliente aqui..."
              className="w-full h-[500px] outline-none text-gray-700 leading-relaxed resize-none text-lg p-2 font-light notion-editor"
            />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Links Úteis</h3>
              <div className="space-y-3">
                {client.links.map(link => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                      {ICONS.Link}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{link.label}</p>
                    </div>
                    {ICONS.External}
                  </a>
                ))}
                <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-400 text-sm transition-all">
                  {ICONS.Plus} Adicionar Link
                </button>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Infos Rápidas</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Criado em</span>
                  <span className="font-medium">12 Nov, 2023</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Última Review</span>
                  <span className="font-medium">Há 2 dias</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientView;
