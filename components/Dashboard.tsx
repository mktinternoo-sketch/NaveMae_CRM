
import React, { useMemo } from 'react';
import { ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#10b981'];

const Dashboard: React.FC = () => {
  // Dados simulados baseados na nova estrutura de produção
  const stats = [
    { label: 'Demandas em WIP', value: 24, change: '+5% carga', icon: ICONS.Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Entregas (Mês)', value: 142, change: '+12% vs out', icon: ICONS.Tasks, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Taxa de Atraso', value: '8%', change: '-2% melhoria', icon: ICONS.Calendar, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Cycle Time Médio', value: '4.2 dias', change: 'Estável', icon: ICONS.Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  const chartData = [
    { name: 'Backlog', value: 12 },
    { name: 'Fazendo', value: 18 },
    { name: 'Revisão', value: 6 },
    { name: 'Entregue', value: 45 },
  ];

  return (
    <div className="flex-1 bg-[#fbfbfa] h-full overflow-y-auto p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Operação FLOWAPP</h1>
        <p className="text-gray-500 mt-1">Visão geral de carga, gargalos e entregas da equipe criativa.</p>
      </header>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            {ICONS.Tasks} Volume de Produção por Etapa
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#9ca3af'}} />
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

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            {ICONS.Clock} Próximos Prazos
          </h2>
          <div className="space-y-4">
            {[
              { client: 'TechFlow', job: 'Banner Site', due: 'Hoje, 18h', priority: 'P0' },
              { client: 'Green Co', job: 'Social Pack', due: 'Amanhã', priority: 'P1' },
              { client: 'AppMaster', job: 'Logo v2', due: '15/Dez', priority: 'P2' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-10 rounded-full ${item.priority === 'P0' ? 'bg-red-500' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800">{item.job}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{item.client}</p>
                </div>
                <span className="text-[10px] font-bold text-gray-500">{item.due}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors">
            Ver calendário completo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
