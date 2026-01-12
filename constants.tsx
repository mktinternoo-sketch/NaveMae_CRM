
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Table as TableIcon, 
  Settings, 
  Plus, 
  Search, 
  MoreHorizontal, 
  ChevronRight,
  Hash,
  Link as LinkIcon,
  FileText,
  Clock,
  ExternalLink,
  Trash2,
  Calendar,
  Sparkles,
  Send,
  MessageSquare,
  X,
  Cake,
  PartyPopper,
  Camera,
  Gift
} from 'lucide-react';

export const ICONS = {
  Dashboard: <LayoutDashboard size={18} />,
  Clients: <Users size={18} />,
  Tasks: <CheckSquare size={18} />,
  Tables: <TableIcon size={18} />,
  Settings: <Settings size={18} />,
  Plus: <Plus size={18} />,
  Search: <Search size={18} />,
  More: <MoreHorizontal size={18} />,
  ChevronRight: <ChevronRight size={18} />,
  Hash: <Hash size={18} />,
  Link: <LinkIcon size={18} />,
  File: <FileText size={18} />,
  Clock: <Clock size={18} />,
  External: <ExternalLink size={18} />,
  Trash: <Trash2 size={18} />,
  Calendar: <Calendar size={18} />,
  Sparkles: <Sparkles size={16} />,
  Send: <Send size={16} />,
  Message: <MessageSquare size={18} />,
  Close: <X size={18} />,
  Cake: <Cake size={18} />,
  PartyPopper: <PartyPopper size={18} />,
  Camera: <Camera size={16} />,
  Gift: <Gift size={16} />
};

export const INITIAL_CLIENTS = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    logo: 'https://picsum.photos/seed/tech/100/100',
    description: 'Empresa de software sediada em São Paulo.',
    wiki: '# Wiki do Cliente: TechFlow\n\nEste cliente é focado em soluções B2B SaaS. \n\n### Pontos Principais\n- Contato principal: Roberto Silva\n- Orçamento mensal: R$ 15.000\n- Foco atual: SEO e Campanhas de Performance.',
    links: [
      { id: 'l1', label: 'Website Principal', url: 'https://techflow.example.com' },
      { id: 'l2', label: 'Dashboard de Vendas', url: '#' }
    ],
    tags: ['Tech', 'SaaS', 'B2B']
  },
  {
    id: '2',
    name: 'Green Garden Co.',
    logo: 'https://picsum.photos/seed/garden/100/100',
    description: 'E-commerce de plantas e jardinagem.',
    wiki: '# Green Garden Wiki\n\nFocado em sustentabilidade e design.\n\n### Estratégia\n- Redes Sociais: Instagram é o canal principal.\n- Influenciadores: Campanha ativa com 5 micro-influenciadores.',
    links: [
      { id: 'l3', label: 'Instagram', url: '#' }
    ],
    tags: ['E-commerce', 'Green']
  }
];

export const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Relatório Mensal de SEO',
    description: 'Compilar dados do Search Console e Semrush.',
    status: 'In Progress' as const,
    priority: 'High' as const,
    assignee: 'Alice',
    dueDate: '2023-12-15',
    clientId: '1'
  },
  {
    id: 't2',
    title: 'Criativos para Campanha de Natal',
    description: 'Criar 3 variações de banners para o Instagram.',
    status: 'To Do' as const,
    priority: 'Medium' as const,
    assignee: 'Bob',
    dueDate: '2023-12-20',
    clientId: '2'
  },
  {
    id: 't3',
    title: 'Ajuste de Budget Ads',
    description: 'Otimizar lances para campanhas de topo de funil.',
    status: 'Review' as const,
    priority: 'High' as const,
    assignee: 'Alice',
    dueDate: '2023-12-18',
    clientId: '1'
  },
  {
    id: 't4',
    title: 'Copy para Newsletter',
    description: 'Escrever 3 variações de assunto.',
    status: 'Done' as const,
    priority: 'Low' as const,
    assignee: 'Bob',
    dueDate: '2023-12-10',
    clientId: '2'
  }
];

export const isBirthdayToday = (birthDateString: string | undefined): boolean => {
  if (!birthDateString) return false;
  const today = new Date();
  const birthDate = new Date(birthDateString);
  return today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth();
};
