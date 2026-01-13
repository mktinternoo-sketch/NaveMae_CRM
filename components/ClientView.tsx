
import React, { useState, useEffect, useRef } from 'react';
import { Client, ClientLink, User } from '../types';
import { ICONS } from '../constants';
import { summarizeWiki } from '../geminiService';

interface ClientViewProps {
  client: Client;
  onUpdate: (updatedClient: Client) => void;
  onDelete: (clientId: string) => void;
  currentUser: User | null;
}

const ClientView: React.FC<ClientViewProps> = ({ client, onUpdate, onDelete, currentUser }) => {
  const [wikiContent, setWikiContent] = useState(client.wiki || '');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Estados para novo link
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Estado para edição de tags
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState(client.tags?.join(', ') || '');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWikiContent(client.wiki || '');
    setAiSummary(null);
    setIsAddingLink(false);
    setIsEditingTags(false);
    setTagInput(client.tags?.join(', ') || '');
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

  const handleAddLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    
    const newLink: ClientLink = {
      id: Math.random().toString(36).substr(2, 9),
      label: newLinkLabel,
      url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`
    };

    const updatedLinks = [...(client.links || []), newLink];
    onUpdate({ ...client, links: updatedLinks });
    
    setNewLinkLabel('');
    setNewLinkUrl('');
    setIsAddingLink(false);
  };

  const handleRemoveLink = (linkId: string) => {
    const updatedLinks = client.links.filter(l => l.id !== linkId);
    onUpdate({ ...client, links: updatedLinks });
  };

  const handleSaveTags = () => {
    const newTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    onUpdate({ ...client, tags: newTags });
    setIsEditingTags(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white min-h-screen text-[#37352f]">
      {/* Notion Style Cover */}
      <div className="relative group/cover w-full h-[30vh] min-h-[180px] bg-[#f2f1ee]">
        {client.cover_url && (
          <img 
            src={client.cover_url} 
            className="w-full h-full object-cover transition-opacity duration-300" 
            alt="Capa" 
          />
        )}
        
        <div className="absolute bottom-4 right-[calc(10%+24px)] md:right-[calc(15%+24px)] opacity-0 group-hover/cover:opacity-100 transition-opacity flex gap-2">
          <button 
            onClick={() => coverInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1 bg-white/90 hover:bg-white border border-gray-200 shadow-sm rounded text-[12px] font-medium transition-all"
          >
            {ICONS.Image} Alterar capa
          </button>
          <input 
            type="file" 
            ref={coverInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleCoverUpload}
          />
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-12 md:px-24 pb-32 relative">
        <div className="absolute -top-16 left-12 md:left-24 group/logo">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-sm overflow-hidden border border-gray-100">
              <img 
                src={client.logo || client.logo_url || 'https://via.placeholder.com/150'} 
                alt={client.name} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            
            <button 
              onClick={() => logoInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity"
            >
              <div className="text-white scale-125">{ICONS.Camera}</div>
            </button>
            <input 
              type="file" 
              ref={logoInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoUpload}
            />
          </div>
        </div>

        <div className="pt-20 space-y-6">
          <input 
            type="text"
            value={client.name}
            onChange={(e) => onUpdate({ ...client, name: e.target.value })}
            className="text-4xl font-extrabold text-[#37352f] tracking-tight bg-transparent border-none outline-none focus:ring-0 w-full p-0"
            placeholder="Sem título"
          />

          <div className="space-y-3 py-4">
            {/* Proprietário - Sempre o usuário logado */}
            <div className="flex items-center text-sm gap-8">
              <div className="w-24 text-gray-400 flex items-center gap-2">
                {ICONS.Clients} Proprietário
              </div>
              <div className="flex items-center gap-2.5 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors cursor-default">
                {currentUser?.photo ? (
                  <img src={currentUser.photo} className="w-5 h-5 rounded-md object-cover border border-gray-200" alt="Owner" />
                ) : (
                  <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center text-[10px] text-white font-black">
                    {currentUser?.name[0] || 'U'}
                  </div>
                )}
                <span className="font-semibold text-gray-700">{currentUser?.name || 'Membro da Equipe'}</span>
              </div>
            </div>
            
            {/* Tags - Sistema de edição corrigido e visual centralizado */}
            <div className="flex items-start text-sm gap-8 group/tags">
              <div className="w-24 text-gray-400 flex items-center gap-2 mt-1">
                {ICONS.Hash} Tags
              </div>
              <div className="flex-1">
                {isEditingTags ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-200">
                    <input 
                      type="text"
                      autoFocus
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onBlur={handleSaveTags}
                      onKeyPress={e => e.key === 'Enter' && handleSaveTags()}
                      className="flex-1 px-3 py-1.5 bg-gray-50 border border-indigo-200 rounded-lg outline-none text-xs font-medium focus:ring-2 focus:ring-indigo-100 transition-all"
                      placeholder="Ex: SEO, Design, 2024 (separe por vírgula)"
                    />
                    <button onClick={handleSaveTags} className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                      OK
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingTags(true)}
                    className="flex flex-wrap gap-2 cursor-pointer min-h-[32px] items-center"
                  >
                    {client.tags?.length > 0 ? client.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center justify-center px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-md text-[11px] font-bold hover:bg-gray-100 hover:border-gray-200 transition-all">
                        {tag}
                      </span>
                    )) : <span className="text-gray-300 italic text-xs">Adicionar tags (clique para editar)...</span>}
                    <button className="opacity-0 group-hover/tags:opacity-100 text-gray-300 hover:text-indigo-500 transition-all p-1">
                      {ICONS.Plus}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center text-sm gap-8">
              <div className="w-24 text-gray-400 flex items-center gap-2">
                {ICONS.Clock} Criado em
              </div>
              <div className="text-gray-500 font-medium">
                {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="flex justify-end">
            <button 
              onClick={handleAiSummary}
              disabled={loadingAi}
              className="flex items-center gap-2 text-[12px] font-bold text-indigo-500 hover:text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
            >
              {loadingAi ? 'Processando...' : <>{ICONS.Sparkles} Resumir com AI</>}
            </button>
          </div>

          <div className="prose prose-sm max-w-none">
            {aiSummary && (
              <div className="my-6 p-4 bg-indigo-50/40 rounded-lg border border-indigo-100 text-sm leading-relaxed text-[#37352f] relative group">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  {ICONS.Sparkles} Resumo Estratégico
                </div>
                {aiSummary}
                <button onClick={() => setAiSummary(null)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-indigo-200 hover:text-indigo-400 transition-opacity">
                  {ICONS.Close}
                </button>
              </div>
            )}

            <textarea 
              value={wikiContent}
              onChange={handleWikiChange}
              className="w-full min-h-[400px] outline-none text-[16px] leading-[1.6] resize-none font-normal placeholder:text-gray-300 bg-transparent"
              placeholder="Pressione '/' para comandos ou comece a documentar..."
            />
          </div>

          {/* Links e Atalhos Integrados */}
          <div className="mt-12 pt-12 border-t border-gray-50">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Recursos e Links</h4>
              <button 
                onClick={() => setIsAddingLink(!isAddingLink)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                {isAddingLink ? ICONS.Close : <>{ICONS.Plus} Adicionar Recurso</>}
              </button>
            </div>

            {/* Formulário para Novo Link */}
            {isAddingLink && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest">Rótulo do Link</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Google Drive"
                      value={newLinkLabel}
                      onChange={e => setNewLinkLabel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest">URL</label>
                    <input 
                      type="text" 
                      placeholder="Ex: drive.google.com/..."
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setIsAddingLink(false)}
                    className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleAddLink}
                    className="px-6 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm"
                  >
                    Salvar Link
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-16">
              {client.links?.map(link => (
                <div key={link.id} className="relative group">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/30 hover:bg-white hover:border-indigo-200 transition-all group"
                  >
                    <div className="text-gray-300 group-hover:text-indigo-500">{ICONS.Link}</div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-900 truncate flex-1">{link.label}</span>
                    <div className="text-gray-200 group-hover:text-indigo-300">{ICONS.External}</div>
                  </a>
                  <button 
                    onClick={() => handleRemoveLink(link.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-red-100 rounded-full flex items-center justify-center text-red-300 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  >
                    {ICONS.Trash}
                  </button>
                </div>
              ))}
              
              {client.drive_link && (
                <a href={client.drive_link} target="_blank" className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-all">
                  <span className="text-sm">🚀</span>
                  <span className="text-sm font-bold text-indigo-700">Google Drive</span>
                </a>
              )}

              {(!client.links || client.links.length === 0) && !client.drive_link && (
                <div className="col-span-full py-8 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300 italic text-sm">
                  Nenhum link cadastrado ainda.
                </div>
              )}
            </div>

            {/* Zona de Perigo - Excluir Marca */}
            <div className="mt-20 pt-12 border-t border-red-50 flex flex-col items-center gap-4">
              <div className="text-center">
                <h5 className="text-sm font-bold text-gray-800">Zona Crítica</h5>
                <p className="text-xs text-gray-400 mt-1">A exclusão da marca é permanente e removerá todas as wikis e links associados.</p>
              </div>
              <button 
                onClick={() => onDelete(client.id)}
                className="flex items-center gap-2 text-[10px] font-black text-red-300 hover:text-red-600 uppercase tracking-[0.2em] transition-all px-6 py-3 border border-red-50 hover:border-red-100 hover:bg-red-50 rounded-xl"
              >
                {ICONS.Trash} Excluir Marca Permanentemente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientView;
