
import React, { useMemo } from 'react';
import { ICONS } from '../constants';
import { Task, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  tasks: Task[];
  members: User[];
}

const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ tasks, members }) => {
  const today = new Date().toISOString().split('T')[0];

  // Cálculo de estatísticas gerais
  const stats = useMemo(() => {
    const inProgress = tasks.filter(t => t.status !== 'Done').length;
    const completedMonth = tasks.filter(t => t.status === 'Done').length;
    const overdue = tasks.filter(t => t.status !== 'Done' && t.dueDate < today).length;
    const delayRate = tasks.length > 0 ? Math.round((overdue / tasks.length) * 100) : 0;

    return [
      { label: 'Demandas Ativas', value: inProgress, change: 'Carga total', icon: ICONS.Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
      { label: 'Entregas Totais', value: completedMonth, change: 'Lifetime', icon: ICONS.Tasks, color: 'text-green-600', bg: 'bg-green-100' },
      { label: 'Taxa de Atraso', value: `${delayRate}%`, change: 'Alerta crítico', icon: ICONS.Calendar, color: 'text-red-600', bg: 'bg-red-100' },
      { label: 'Total de Tarefas', value: tasks.length, change: 'No sistema', icon: ICONS.Hash, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    ];
  }, [tasks, today]);

  // Ranking de Colaboradores
  const leaderboard = useMemo(() => {
    return members.map(member => {
      const userTasks = tasks.filter(t => t.assignee === member.name);
      const delivered = userTasks.filter(t => t.status === 'Done').length;
      const open = userTasks.filter(t => t.status !== 'Done').length;
      const delayed = userTasks.filter(t => t.status !== 'Done' && t.dueDate < today).length;

      // Cálculo do Score FLOW (FPS - Flow Performance Score)
      // Entregas: +20 pts | Aberto: +5 pts | Atraso: -30 pts
      const score = (delivered * 20) + (open * 5) - (delayed * 30);
      const winRate = userTasks.length > 0 ? Math.round((delivered / userTasks.length) * 100) : 0;

      return {
        ...member,
        delivered,
        open,
        delayed,
        score: Math.max(0, score),
        winRate
      };
    }).sort((a, b) => b.score - a.score);
  }, [tasks, members, today]);

  const chartData = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Review', value: tasks.filter(t => t.status === 'Review').length },
    { name: 'Done', value: tasks.filter(t => t.status === 'Done').length },
  ];

  return (
    <div className="flex-1 bg-[#fbfbfa] h-full overflow-y-auto p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Operação FLOW</h1>
        <p className="text-gray-500 mt-1">Visão geral de carga, gargalos e entregas da equipe criativa.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
              {s.icon}
            </div>
            <p className="text-sm font-medium text-gray-400">{s.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{s.value}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Kanban Health Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            {ICONS.Tasks} Saúde do Workflow
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{fill: '#9ca3af'}} />
                <Tooltip cursor={{fill: '#f9f9f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deadlines Quick View */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            {ICONS.Clock} Próximos Prazos
          </h2>
          <div className="space-y-4">
            {tasks.filter(t => t.status !== 'Done').sort((a,b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5).map((task, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className={`w-1 h-8 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-indigo-200'}`} />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-gray-800 truncate">{task.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{task.assignee}</p>
                </div>
                <span className={`text-[10px] font-bold ${task.dueDate < today ? 'text-red-500' : 'text-gray-500'}`}>{task.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipe Leaderboard - THE COMPETITION AREA */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-20">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {ICONS.Sparkles} Ranking de Performance FLOW
            </h2>
            <p className="text-xs text-gray-400 mt-1 italic">Cálculo baseado em entregas, compromisso com prazos e carga de trabalho.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-black text-gray-300 uppercase block tracking-widest">Líder atual</span>
              <span className="text-sm font-bold text-indigo-600">{leaderboard[0]?.name || '--'}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
              {ICONS.Gift}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4 w-16">Pos</th>
                <th className="px-8 py-4">Colaborador</th>
                <th className="px-8 py-4 text-center">Entregas</th>
                <th className="px-8 py-4 text-center">Atrasos</th>
                <th className="px-8 py-4 text-center">Abertas</th>
                <th className="px-8 py-4 text-center">Win Rate</th>
                <th className="px-8 py-4 text-right pr-12">Score FLOW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaderboard.map((member, index) => (
                <tr key={member.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center">
                      {index === 0 ? <span className="text-xl">🥇</span> : 
                       index === 1 ? <span className="text-xl">🥈</span> : 
                       index === 2 ? <span className="text-xl">🥉</span> : 
                       <span className="text-sm font-black text-gray-300">#{index + 1}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={member.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`} 
                          className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm"
                          alt={member.name}
                        />
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-[8px]">
                            ⚡
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{member.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-bold text-green-600">{member.delivered}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-sm font-bold ${member.delayed > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                      {member.delayed}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-bold text-orange-500">{member.open}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] font-bold text-gray-700">{member.winRate}%</span>
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${member.winRate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right pr-12">
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-black text-gray-900 leading-none">{member.score}</span>
                      <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Pontos</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaderboard.length === 0 && (
            <div className="py-20 text-center text-gray-300 italic text-sm">
              Nenhum dado de performance disponível no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
