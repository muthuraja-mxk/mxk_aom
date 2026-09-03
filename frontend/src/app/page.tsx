'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Database, 
  Server, 
  Layers, 
  Plus, 
  Search, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Cpu, 
  Terminal, 
  ExternalLink,
  Code2,
  Sparkles,
  Zap,
  Boxes
} from 'lucide-react';

interface HealthData {
  status: string;
  timestamp: string;
  environment: string;
  runtime: {
    framework: string;
    php_version: string;
    sapi: string;
  };
  database: {
    status: string;
    driver: string | null;
    version: string | null;
    target: string;
  };
}

interface Item {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
  created_at: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showJsonRaw, setShowJsonRaw] = useState<boolean>(false);
  const [rawPayload, setRawPayload] = useState<any>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000';
  };

  const fetchHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const res = await fetch(`${getBackendUrl()}/api/v1/health`, { cache: 'no-store' });
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error('Health fetch error:', err);
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    setItemsLoading(true);
    try {
      let url = `${getBackendUrl()}/api/v1/items?`;
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (statusFilter !== 'all') url += `status=${encodeURIComponent(statusFilter)}&`;

      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      setRawPayload(data);
      if (data.success && data.data && Array.isArray(data.data.data)) {
        setItems(data.data.data);
      } else if (Array.isArray(data.data)) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Items fetch error:', err);
    } finally {
      setItemsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchHealth();
    fetchItems();
  }, [fetchHealth, fetchItems]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${getBackendUrl()}/api/v1/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          status: newStatus,
          priority: newPriority,
          metadata: { created_via: 'Next.js 16 REST Dashboard' },
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewDescription('');
        setNewStatus('pending');
        setNewPriority('medium');
        setIsModalOpen(false);
        fetchItems();
      }
    } catch (err) {
      console.error('Failed to create item:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource item?')) return;

    try {
      const res = await fetch(`${getBackendUrl()}/api/v1/items/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleToggleStatus = async (item: Item) => {
    const nextStatusMap: Record<Item['status'], Item['status']> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
    };
    const updatedStatus = nextStatusMap[item.status];

    try {
      const res = await fetch(`${getBackendUrl()}/api/v1/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedStatus }),
      });
      if (res.ok) {
        fetchItems();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header Banner */}
      <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                  Laravel 13 + Next.js 16
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Monorepo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Containerized REST Architecture • PHP 8.4 • Node 26 • MySQL 9.7
              </p>
            </div>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-red-950/50 text-red-300 border border-red-800/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              Laravel 13 (PHP 8.4)
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-cyan-950/50 text-cyan-300 border border-cyan-800/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Next.js 16.3 (Node 26)
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-blue-950/50 text-blue-300 border border-blue-800/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              MySQL 9.7
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* System Diagnostics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Backend Status Card */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Server className="w-24 h-24 text-indigo-400" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-200">REST API Backend</h3>
              </div>
              <button 
                onClick={fetchHealth} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Refresh Status"
              >
                <RefreshCw className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Status</span>
                {health?.status === 'ok' ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    <AlertCircle className="w-3.5 h-3.5" /> Offline
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Framework</span>
                <span className="font-mono text-xs text-slate-200">{health?.runtime?.framework || 'Laravel 13'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">PHP Runtime</span>
                <span className="font-mono text-xs text-slate-200">{health?.runtime?.php_version || '8.4.x'}</span>
              </div>
            </div>
          </div>

          {/* Database Status Card */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Database className="w-24 h-24 text-cyan-400" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-200">MySQL Database</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                v9.7
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Connection</span>
                {health?.database?.status === 'connected' ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Clock className="w-3.5 h-3.5" /> Connecting...
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Driver</span>
                <span className="font-mono text-xs text-slate-200">{health?.database?.driver || 'mysql'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Server Version</span>
                <span className="font-mono text-xs text-slate-200 truncate max-w-[160px]">{health?.database?.version || 'MySQL 9.x'}</span>
              </div>
            </div>
          </div>

          {/* Frontend Node 26 Card */}
          <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers className="w-24 h-24 text-purple-400" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-200">Next.js Frontend</h3>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                v16.3
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Node Environment</span>
                <span className="font-mono text-xs text-purple-300">Node.js 26.x</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Rendering</span>
                <span className="font-mono text-xs text-slate-200">App Router</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">API Endpoint</span>
                <span className="font-mono text-xs text-indigo-300">/api/v1/*</span>
              </div>
            </div>
          </div>
        </section>

        {/* REST API Resource Operations Section */}
        <section className="glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                REST API Resource Manager
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Live interactive CRUD operations communicating with Laravel 13 backend & MySQL 9.7
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowJsonRaw(!showJsonRaw)}
                className="px-3 py-2 text-xs font-medium rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                {showJsonRaw ? 'Hide JSON Payload' : 'Inspect REST JSON'}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create New Resource
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search items by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {['all', 'pending', 'in_progress', 'completed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
              <button
                onClick={fetchItems}
                className="p-2 rounded-lg bg-slate-900/60 text-slate-400 hover:text-white border border-white/5 ml-auto"
                title="Reload List"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${itemsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* RAW REST JSON Inspector */}
          {showJsonRaw && (
            <div className="rounded-xl bg-slate-950 border border-indigo-500/30 p-4 font-mono text-xs overflow-x-auto text-indigo-300 space-y-2">
              <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  GET /api/v1/items
                </span>
                <span>Response Headers: application/json</span>
              </div>
              <pre className="max-h-60 overflow-y-auto">
                {JSON.stringify(rawPayload, null, 2)}
              </pre>
            </div>
          )}

          {/* Items Grid */}
          {itemsLoading ? (
            <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-sm">Fetching items from Laravel REST API...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-slate-400 glass-card rounded-xl p-8">
              <Boxes className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-300">No items found</p>
              <p className="text-xs text-slate-500 mt-1">Create your first item or adjust your search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="glass-card rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-100 text-base leading-snug">{item.title}</h3>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* Status Toggle Badge */}
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize border transition-all ${
                          item.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            : item.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-slate-500/10 text-slate-300 border-slate-500/30 hover:bg-slate-500/20'
                        }`}
                        title="Click to cycle status"
                      >
                        {item.status.replace('_', ' ')}
                      </button>

                      {/* Priority Tag */}
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider ${
                        item.priority === 'high'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                          : item.priority === 'medium'
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                          : 'bg-slate-900 text-slate-400'
                      }`}>
                        {item.priority}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">
                      #{item.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal for Creating New Resource */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel rounded-2xl max-w-md w-full p-6 space-y-5 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Create New API Item
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement JWT Auth service"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed specification..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
