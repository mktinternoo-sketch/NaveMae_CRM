
import React, { useState, useMemo } from 'react';
import { Task, Status, User, Priority, Client } from '../types';
import { ICONS } from '../constants';

interface TaskBoardProps {
  currentUser: User | null;
  clients: Client[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface Filters {
  search: string;
  clientId: string;
  status: string;
  priority: string;
  type: string;
  assignee: string;
  dateRange: string;
  tag: string;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ currentUser, clients, tasks, setTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [filters, setFilters] = useState<Filters>({
    search: '',
    clientId: 'all',
    status: 'all',
    priority: 'all',
    type: 'all',
    assignee: 'all',
    dateRange: 'all',
    tag: 'all'
  });

  const columns: Status[] = ['To Do', 'In Progress', 'Review', 'Done'];

  const uniqueTypes = useMemo(() => Array.from(new Set(tasks.map(t => t.type).filter(Boolean))), [tasks]);
  const uniqueAssignees = useMemo(() => Array.from(new Set(tasks.map(t => t.assignee).filter(Boolean))), [tasks]);
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    tasks.forEach(t => t.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = (task.title?.toLowerCase() || '').includes(filters.search.toLowerCase()) || 
                          (task.description?.toLowerCase() || '').includes(filters.search.toLowerCase());
      const matchClient = filters.clientId === 'all' || task.clientId === filters.clientId;
      const matchStatus = filters.status === 'all' || task.status === filters.status;
      const matchPriority = filters.priority === 'all' || task.priority === filters.priority;
      const matchType = filters.type === 'all' || task.type === filters.type;
      const matchAssignee = filters.assignee === 'all' || task.assignee === filters.assignee;
      const matchTag = filters.tag === 'all' || task.tags?.includes(filters.tag);

      let matchDate = true;
      const today = new Date().toISOString().split('T')[0];
      if (filters.dateRange === 'today') matchDate = task.dueDate === today;
      if (filters.dateRange === 'overdue') matchDate = task.dueDate < today && task.status !== 'Done';
      if (filters.dateRange === 'this-week') {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        const taskDate = new Date(task.dueDate);
        matchDate = taskDate >= now && taskDate <= nextWeek;
      }

      return matchSearch && matchClient && matchStatus && matchPriority && matchType && matchAssignee && matchDate && matchTag;
    });
  }, [tasks, filters]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const getPrioritySidebar = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const handleOpenModal = (task?: Task, status?: Status) => {
    if (task) {
      setEditingTask({ ...task });
      setTagInput(task.tags?.join(', ') || '');
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: '',
        description: '',
        status: status || 'To Do',
        priority: 'Medium',
        assignee: currentUser?.name || 'Eu',
        dueDate: new Date().toISOString().split('T')[0],
        clientId: clients.length > 0 ? clients[0].id : '',
        type: '',
        tags: []
      };
      setEditingTask(newTask);
      setTagInput('');
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!editingTask || !editingTask.title.trim()) return;
    
    const processedTags = tagInput.split(',').map(s => s.trim()).filter(Boolean);
    const taskToSave = { ...editingTask, tags: processedTags };

    setTasks(prev => {
      const exists = prev.find(t => t.id === taskToSave.id);
      if (exists) {
        return prev.map(t => t.id === taskToSave.id ? taskToSave : t);
      }
      return [...prev, taskToSave];
    });

    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Tem certeza que deseja excluir esta tarefa? Esta ação é irreversível.')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      if (editingTask?.id === id) {
        setIsModalOpen(false);
        setEditingTask(null);
      }
    }
  };

  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Sem Marca';
  };

  const resetFilters = () => setFilters({
    search: '',
    clientId: 'all',
    status: 'all',
    priority: 'all',
    type: 'all',
    assignee: 'all',
    dateRange: 'all',
    tag: 'all'
  });

  return (
    <div className="flex-1 bg-white h-full flex flex-col text-[#37352f]">
      <div className="px-12 py-8 border-b border-gray-50 bg-white sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Produção & CRM</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium italic">Operação em tempo real da equipe FLOW.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                  {ICONS.Search}
                </div>
                <input 
                  type="text" 
                  placeholder="Pesquisar..."
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-100 w-48 transition-all"
                />
             </div>
             <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                 showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
               }`}
             >
               {ICONS.Filter} Filtros
             </button>
             <button 
               onClick={() => handleOpenModal()}
               className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
             >
               {ICONS.Plus} Nova Tarefa
             </button>
          </div>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-3 items-center animate-in slide-in-from-top-2">
            <select value={filters.clientId} onChange={e => setFilters({...filters, clientId: e.target.value})} className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-black uppercase text-gray-500 border border-transparent hover:border-gray-200 outline-none">
              <option value="all">Marca: Todos</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={resetFilters} className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest ml-auto">Limpar</button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto p-12 bg-[#fbfbfa]">
        <div className="flex gap-8 min-h-full">
          {columns.map(status => (
            <div key={status} className="w-80 flex-shrink-0 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.1em] ${
                    status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 
                    status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {status}
                  </span>
                  <span className="text-gray-300 text-[11px] font-bold">
                    {filteredTasks.filter(t => t.status === status).length}
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {filteredTasks.filter(t => t.status === status).map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => handleOpenModal(task)}
                    className={`group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all cursor-pointer overflow-hidden ${
                      task.status === 'Done' ? 'opacity-75' : ''
                    }`}
                  >
                    {/* Barra Lateral de Prioridade */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPrioritySidebar(task.priority)}`} />

                    {/* Botão de Excluir Flutuante (Melhorado) */}
                    <button 
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-200 hover:text-red-500 hover:border-red-100 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                      title="Excluir tarefa"
                    >
                      <div className="scale-90">{ICONS.Trash}</div>
                    </button>

                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase bg-gray-50 text-gray-400 border border-gray-100">
                          {getClientName(task.clientId)}
                        </span>
                        {task.status === 'Done' && (
                          <span className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                            ✓ Entregue
                          </span>
                        )}
                      </div>

                      <h3 className={`font-bold text-[14px] text-gray-800 mb-2 leading-snug ${task.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
                        {task.title || 'Tarefa sem título'}
                      </h3>
                      
                      {task.description && (
                        <p className="text-[12px] text-gray-400 leading-relaxed mb-4 line-clamp-2 italic">
                          {task.description}
                        </p>
                      )}

                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {task.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center justify-center px-2 py-1 bg-indigo-50 text-indigo-400 rounded-md text-[9px] font-bold border border-indigo-100/30">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className={`flex items-center gap-1.5 ${
                          task.dueDate < new Date().toISOString().split('T')[0] && task.status !== 'Done' ? 'text-red-400' : 'text-gray-300'
                        }`}>
                          {ICONS.Clock}
                          <span className="text-[10px] font-bold">{task.dueDate}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight max-w-[80px] truncate">
                             {task.assignee}
                           </span>
                           <div className="w-7 h-7 rounded-xl bg-black flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                             {task.assignee ? task.assignee[0].toUpperCase() : 'U'}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => handleOpenModal(undefined, status)}
                  className="w-full py-4 flex items-center justify-center gap-2 text-gray-300 hover:bg-white hover:text-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 border-dashed border-gray-100 hover:border-indigo-100 hover:shadow-md"
                >
                  {ICONS.Plus} Adicionar Tarefa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && editingTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  {ICONS.File}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">Gerenciar Tarefa</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => handleDeleteTask(editingTask.id, e as any)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Excluir tarefa permanentemente"
                >
                  {ICONS.Trash}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-all">
                  {ICONS.Close}
                </button>
              </div>
            </div>

            <div className="p-10 space-y-8 overflow-y-auto max-h-[75vh]">
              <input 
                type="text"
                placeholder="Qual o nome da entrega?"
                value={editingTask.title}
                onChange={e => setEditingTask({...editingTask, title: e.target.value})}
                className="w-full text-3xl font-black text-gray-800 placeholder:text-gray-200 outline-none border-none bg-transparent"
                autoFocus
              />

              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    {ICONS.Clock} Status
                  </label>
                  <select value={editingTask.status} onChange={e => setEditingTask({...editingTask, status: e.target.value as Status})} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs text-gray-600 border border-transparent focus:border-indigo-100 appearance-none">
                    {columns.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    {ICONS.Clients} Marca
                  </label>
                  <select value={editingTask.clientId} onChange={e => setEditingTask({...editingTask, clientId: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs text-gray-600 border border-transparent focus:border-indigo-100 appearance-none">
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    {ICONS.Sparkles} Prioridade
                  </label>
                  <select value={editingTask.priority} onChange={e => setEditingTask({...editingTask, priority: e.target.value as Priority})} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs text-gray-600 border border-transparent focus:border-indigo-100 appearance-none">
                    <option value="Low">BAIXA</option>
                    <option value="Medium">MÉDIA</option>
                    <option value="High">ALTA</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    {ICONS.Calendar} Prazo Final
                  </label>
                  <input type="date" value={editingTask.dueDate} onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-bold text-xs text-gray-600 border border-transparent focus:border-indigo-100" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  {ICONS.Hash} Tags (vírgula para separar)
                </label>
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none font-medium text-xs text-gray-600 border border-transparent focus:border-indigo-100" placeholder="Ex: SEO, Performance, Vídeo" />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  {ICONS.File} Detalhamento
                </label>
                <textarea 
                  placeholder="Instruções para a equipe..."
                  value={editingTask.description}
                  onChange={e => setEditingTask({...editingTask, description: e.target.value})}
                  className="w-full min-h-[120px] bg-gray-50 rounded-2xl p-4 outline-none text-sm text-gray-600 leading-relaxed placeholder:text-gray-200 resize-none border border-transparent focus:border-indigo-100"
                />
              </div>
            </div>

            <div className="p-10 pt-0 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-xs font-black uppercase text-gray-400 hover:text-gray-600 transition-colors">Fechar</button>
              <button onClick={handleSaveTask} className="px-10 py-3 bg-black text-white rounded-2xl text-xs font-black uppercase hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
