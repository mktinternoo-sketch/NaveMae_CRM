
import React, { useState } from 'react';
import { Task, Status } from '../types';
import { ICONS, INITIAL_TASKS } from '../constants';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const columns: Status[] = ['To Do', 'In Progress', 'Review', 'Done'];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const addTask = (status: Status) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nova Tarefa',
      description: 'Clique para editar...',
      status: status,
      priority: 'Medium',
      assignee: 'Eu',
      dueDate: new Date().toISOString().split('T')[0],
      clientId: '1'
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="flex-1 bg-[#ffffff] h-full flex flex-col">
      <div className="px-12 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tarefas & CRM</h1>
          <p className="text-gray-500 text-sm">Gerencie o fluxo de trabalho da sua agência em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
            {ICONS.Plus} Nova Tarefa
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-12 pt-0">
        <div className="flex gap-6 min-h-[500px]">
          {columns.map(status => (
            <div key={status} className="w-80 flex-shrink-0 group">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {status}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">
                    {tasks.filter(t => t.status === status).length}
                  </span>
                </div>
                <button 
                  onClick={() => addTask(status)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-400 group-hover:opacity-100 opacity-0 transition-opacity"
                >
                  {ICONS.Plus}
                </button>
              </div>

              <div className="space-y-3">
                {tasks.filter(t => t.status === status).map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group/card">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <button className="opacity-0 group-card:opacity-100 text-gray-300 hover:text-gray-600">
                        {ICONS.More}
                      </button>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-1">{task.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">{task.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-gray-400">
                        {ICONS.Clock}
                        <span className="text-[10px] font-medium">{task.dueDate}</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[8px] font-bold text-indigo-700">
                        {task.assignee[0]}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => addTask(status)}
                  className="w-full py-2 flex items-center justify-center gap-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-lg text-sm transition-colors border border-dashed border-transparent hover:border-gray-200"
                >
                  {ICONS.Plus} Novo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
