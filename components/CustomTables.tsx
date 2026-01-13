
import React, { useState } from 'react';
import { CustomTable, TableColumn, TableRow } from '../types';
import { ICONS } from '../constants';

const CustomTables: React.FC = () => {
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  
  const [tables, setTables] = useState<CustomTable[]>([
    {
      id: 'tab1',
      name: 'Budget de Tráfego 2024',
      columns: [
        { id: 'c1', header: 'Campanha', type: 'text' },
        { id: 'c2', header: 'Canal', type: 'select' },
        { id: 'c3', header: 'Investimento (R$)', type: 'number' },
        { id: 'c4', header: 'Data Início', type: 'date' },
      ],
      rows: [
        { id: 'r1', data: { c1: 'Black Friday Tech', c2: 'Meta Ads', c3: 5000, c4: '2024-11-01' } },
        { id: 'r2', data: { c1: 'Brand Awareness', c2: 'Google Ads', c3: 2000, c4: '2024-01-15' } },
      ]
    }
  ]);

  const activeTable = tables.find(t => t.id === activeTableId) || tables[0];

  const addRow = () => {
    const newRow: TableRow = {
      id: Math.random().toString(36).substr(2, 9),
      data: {}
    };
    setTables(tables.map(t => t.id === activeTable.id ? { ...t, rows: [...t.rows, newRow] } : t));
  };

  const deleteRow = (rowId: string) => {
    if (window.confirm('Excluir este registro permanentemente?')) {
      setTables(prev => prev.map(t => {
        if (t.id === activeTable.id) {
          return { ...t, rows: t.rows.filter(r => r.id !== rowId) };
        }
        return t;
      }));
    }
  };

  const createTable = () => {
    const newTable: CustomTable = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Nova Tabela',
      columns: [{ id: 'tc1', header: 'Nome', type: 'text' }],
      rows: [{ id: 'tr1', data: { tc1: 'Exemplo' } }]
    };
    setTables([...tables, newTable]);
    setActiveTableId(newTable.id);
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      <div className="px-12 py-8 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            {ICONS.Tables}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{activeTable.name}</h1>
            <p className="text-gray-400 text-sm">Visualização de base de dados customizada.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={createTable}
            className="text-sm font-medium text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200"
          >
            Nova Tabela
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-12">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 px-4 py-3 bg-gray-50/50"></th>
              {activeTable.columns.map(col => (
                <th key={col.id} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    {ICONS.Hash}
                    {col.header}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 bg-gray-50/50 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {activeTable.rows.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                <td className="px-4 py-3 text-xs text-gray-400 text-center">{idx + 1}</td>
                {activeTable.columns.map(col => (
                  <td key={col.id} className="px-4 py-3 text-sm border-r border-gray-100">
                    <input 
                      type={col.type === 'number' ? 'number' : 'text'}
                      defaultValue={row.data[col.id]}
                      className="bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-blue-100 rounded px-1"
                    />
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => deleteRow(row.id)}
                    className="text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50"
                    title="Excluir linha"
                  >
                    {ICONS.Trash}
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={activeTable.columns.length + 2}>
                <button 
                  onClick={addRow}
                  className="w-full py-4 text-left px-12 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50/30 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  {ICONS.Plus} Novo Registro
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTables;
