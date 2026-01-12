
import React, { useState, useMemo } from 'react';
import { ICONS, INITIAL_TASKS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string>('Todos');
  
  const members = useMemo(() => {
    const unique = Array.from(new Set(INITIAL_TASKS.map(t => t.assignee)));
    return ['Todos', ...unique];
  }, []);

  const chartData = useMemo(() => {
    const filteredTasks = selectedMember === 'Todos' 
      ? INITIAL_TASKS 
      : INITIAL_TASKS.filter(t => t.assignee === selectedMember);

    // Grouping by status for dynamic visual feedback of productivity
    const statusCounts = {
      'To Do': 0,
      'In Progress': 0,
      'Review': 0,
      'Done': 0
    };

    filteredTasks.forEach(t => {
      statusCounts[t.status]++;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [selectedMember]);

  return (
    <div className="flex-1 bg-white h-full overflow-y-auto p-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Bom dia, Agência! 👋</h1>
        <p className="text-gray-500">Aqui está o que está acontecendo no seu workspace hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl border border-gray-100 bg-[#f9f9f9] notion-shadow transition-transform hover:scale-[1.01] cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            {ICONS.Clients}
          </div>
          <p className="text-gray-500 text-sm font-medium">Clientes Ativos</p>
          <p className="text-3xl font-bold mt-1">12</p>
          <p className="text-xs text-green-600 mt-2 font-medium">+2 este mês</p>
        </div>
        
        <div className="p-6 rounded-2xl border border-gray-100 bg-[#f9f9f9] notion-shadow transition-transform hover:scale-[1.01] cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
            {ICONS.Tasks}
          </div>
          <p className="text-gray-500 text-sm font-medium">Tarefas Pendentes</p>
          <p className="text-3xl font-bold mt-1">{INITIAL_TASKS.filter(t => t.status !== 'Done').length}</p>
          <p className="text-xs text-orange-600 mt-2 font-medium">Fluxo constante</p>
        </div>

        <div className="p-6 rounded-2xl border border-gray-100 bg-[#f9f9f9] notion-shadow transition-transform hover:scale-[1.01] cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
            {ICONS.Clock}
          </div>
          <p className="text-gray-500 text-sm font-medium">Horas Faturadas</p>
          <p className="text-3xl font-bold mt-1">164h</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">Ciclo: Dezembro</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 notion-shadow">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {ICONS.Tasks} 
              Produtividade por Status
            </h2>
            <select 
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="text-xs font-medium border border-gray-200 rounded-md px-2 py-1 outline-none bg-white hover:bg-gray-50 cursor-pointer"
            >
              {members.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#9ca3af'}} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f9f9f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 notion-shadow">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            {ICONS.Calendar}
            Agenda de Hoje
          </h2>
          <div className="space-y-4">
            {[
              { time: '10:00', title: 'Daily Standup', type: 'Reunião' },
              { time: '14:00', title: 'Revisão Green Garden', type: 'Design' },
              { time: '16:30', title: 'Lançamento Campanha', type: 'Performance' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">{ev.time}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold">{ev.title}</h4>
                  <p className="text-xs text-gray-400">{ev.type}</p>
                </div>
                {ICONS.ChevronRight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
