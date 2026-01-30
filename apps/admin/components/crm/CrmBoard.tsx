"use client";

import type { DragEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Plus, Phone, Mail, Calendar, FileText, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { CRM_STAGES, DEFAULT_CRM_COLUMNS, LEAD_SOURCES, LEAD_SOURCE_LABELS } from '@/lib/constants';
import { CrmColumn, CrmClient, QuickCreateForm } from './types';
import CrmClientModal from './CrmClientModal';

export default function CrmBoard() {
  const [columns] = useState<readonly CrmColumn[]>(DEFAULT_CRM_COLUMNS);
  const [clients, setClients] = useState<CrmClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<CrmClient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [dragOverSlug, setDragOverSlug] = useState<string | null>(null);
  const [quickForm, setQuickForm] = useState<QuickCreateForm>({
    full_name: '',
    phone: '',
    email: '',
    company: '',
    source: '',
    crm_stage: CRM_STAGES.PROSPECT,
    notes: '',
  });
  const [quickLoading, setQuickLoading] = useState(false);
  const toast = useToast();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      const clientList = Array.isArray(data.data) ? data.data : [];
      setClients(clientList.sort((a, b) =>
        (new Date(b.created_at || 0).getTime()) - (new Date(a.created_at || 0).getTime())
      ));
    } catch (err) {
      console.error('[CRM] clients fetch failed', err);
      setError('Impossible de charger les clients.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchClients();
  }, [fetchClients]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.full_name.toLowerCase().includes(search.toLowerCase()) ||
        client.email?.toLowerCase().includes(search.toLowerCase()) ||
        client.phone.includes(search) ||
        client.company?.toLowerCase().includes(search.toLowerCase());
      const matchesStage = stageFilter ? client.crm_stage === stageFilter : true;
      const matchesSource = sourceFilter ? client.source === sourceFilter : true;
      return matchesSearch && matchesStage && matchesSource;
    });
  }, [clients, search, stageFilter, sourceFilter]);

  const columnsWithCounts = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      count: filteredClients.filter((client) => client.crm_stage === col.slug).length,
    }));
  }, [columns, filteredClients]);

  const openClientModal = (client: CrmClient) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleStageChange = async (clientId: string, nextStage: string) => {
    const previous = clients.find((client) => client.id === clientId);

    // Optimistic update
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? { ...client, crm_stage: nextStage as any } : client
      )
    );

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crm_stage: nextStage }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stage');
      }

      toast.addToast('Stage mis à jour', 'success');
    } catch (err) {
      console.error('[CRM] stage update failed', err);
      toast.addToast('Impossible de déplacer la fiche.', 'error');

      // Revert on error
      if (previous) {
        setClients((prev) =>
          prev.map((client) =>
            client.id === clientId ? { ...client, crm_stage: previous.crm_stage } : client
          )
        );
      }
    }
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>, slug: string) => {
    event.preventDefault();
    setDragOverSlug(null);
    const clientId = event.dataTransfer.getData('clientId');
    if (!clientId) return;
    await handleStageChange(clientId, slug);
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, clientId: string) => {
    event.dataTransfer.setData('clientId', clientId);
  };

  const handleQuickCreate = async () => {
    if (!quickForm.full_name || !quickForm.phone) {
      toast.addToast('Nom et téléphone requis', 'error');
      return;
    }

    setQuickLoading(true);
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quickForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création');
      }

      toast.addToast('Client créé avec succès', 'success');
      setQuickOpen(false);
      setQuickForm({
        full_name: '',
        phone: '',
        email: '',
        company: '',
        source: '',
        crm_stage: CRM_STAGES.PROSPECT,
        notes: '',
      });
      await fetchClients();
    } catch (err) {
      console.error('[CRM] quick create failed', err);
      toast.addToast('Impossible de créer le client', 'error');
    } finally {
      setQuickLoading(false);
    }
  };

  // Couleur de fond selon la colonne
  const getColumnBgClass = (color?: string) => {
    switch (color) {
      case 'gray': return 'from-slate-50 to-slate-100/60';
      case 'blue': return 'from-blue-50 to-blue-100/60';
      case 'purple': return 'from-purple-50 to-purple-100/60';
      case 'yellow': return 'from-amber-50 to-amber-100/60';
      case 'orange': return 'from-orange-50 to-orange-100/60';
      case 'teal': return 'from-teal-50 to-teal-100/60';
      case 'red': return 'from-red-50 to-red-100/60';
      default: return 'from-white to-slate-50/60';
    }
  };

  // Get badge variant for lead source
  const getSourceBadge = (source?: string) => {
    if (!source) return null;
    const label = LEAD_SOURCE_LABELS[source.toUpperCase() as keyof typeof LEAD_SOURCES] || source;
    return <Badge size="sm" variant="secondary">{label}</Badge>;
  };

  const renderColumns = () => {
    if (loading) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="w-60 h-64 rounded-2xl bg-white/70 animate-pulse"
            />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-sm text-red-600">{error}</div>
      );
    }

    return (
      <div className="flex gap-4 overflow-x-auto pb-6">
        {columnsWithCounts.map((column) => (
          <div
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, column.slug)}
            onDragEnter={() => setDragOverSlug(column.slug)}
            onDragLeave={() => setDragOverSlug(null)}
            className={`min-w-[320px] max-w-[380px] flex-1 flex flex-col gap-3 rounded-3xl bg-gradient-to-b ${getColumnBgClass(column.color)} p-4 shadow-sm border border-transparent transition-all ${
              dragOverSlug === column.slug ? 'border-[#1e3a8a]/70 shadow-md' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#0f172a] uppercase tracking-wide">
                  {column.label}
                </h3>
                {column.description && (
                  <p className="text-xs text-[#64748b] mt-0.5">{column.description}</p>
                )}
              </div>
              <Badge size="sm">{column.count}</Badge>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
              {filteredClients
                .filter((client) => client.crm_stage === column.slug)
                .map((client) => (
                  <div
                    key={client.id}
                    draggable
                    onDragStart={(event) => handleDragStart(event, client.id)}
                    onClick={() => openClientModal(client)}
                    className="group rounded-2xl border border-[#e2e8f0] bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-[#0f172a] truncate">
                          {client.full_name}
                        </h4>
                        {client.company && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building2 className="w-3 h-3 text-[#64748b]" />
                            <p className="text-xs text-[#64748b] truncate">{client.company}</p>
                          </div>
                        )}
                      </div>
                      {client.tracking_id && (
                        <span className="text-xs text-[#64748b] font-mono">
                          #{client.tracking_id}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-[#64748b]">
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {client.source && getSourceBadge(client.source)}
                      {client.industry && (
                        <Badge size="sm" variant="accent">{client.industry}</Badge>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs text-[#64748b]">
                      {client.appointments_count !== undefined && client.appointments_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{client.appointments_count} RDV</span>
                        </div>
                      )}
                      {client.quotes_count !== undefined && client.quotes_count > 0 && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{client.quotes_count} devis</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              {filteredClients.filter((client) => client.crm_stage === column.slug).length === 0 && (
                <p className="text-sm text-[#64748b] mt-1">Aucun client.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const sources = useMemo(() => {
    const allSources = new Set<string>();
    clients.forEach((client) => {
      if (client.source) allSources.add(client.source);
    });
    return Array.from(allSources).sort();
  }, [clients]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] bg-clip-text text-transparent">
              CRM Pipeline
            </h1>
            <p className="text-sm text-[#64748b] mt-1">
              Glissez une fiche pour changer de stage. Cliquez pour voir les détails.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setQuickOpen(true)}
            >
              Nouveau client
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="">Tous les stages</option>
            {columns.map((col) => (
              <option key={col.id} value={col.slug}>
                {col.label}
              </option>
            ))}
          </Select>
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">Toutes les sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {LEAD_SOURCE_LABELS[source.toUpperCase() as keyof typeof LEAD_SOURCES] || source}
              </option>
            ))}
          </Select>
        </div>

        {renderColumns()}
      </div>

      {/* Quick Create Modal */}
      <Modal
        isOpen={quickOpen}
        onClose={() => setQuickOpen(false)}
        title="Nouveau client"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nom complet *"
            value={quickForm.full_name}
            onChange={(e) => setQuickForm({ ...quickForm, full_name: e.target.value })}
            placeholder="Jean Dupont"
            required
          />
          <Input
            label="Téléphone *"
            type="tel"
            value={quickForm.phone}
            onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
            placeholder="+32 123 45 67 89"
            required
          />
          <Input
            label="Email"
            type="email"
            value={quickForm.email || ''}
            onChange={(e) => setQuickForm({ ...quickForm, email: e.target.value })}
            placeholder="jean@exemple.be"
          />
          <Input
            label="Entreprise"
            value={quickForm.company || ''}
            onChange={(e) => setQuickForm({ ...quickForm, company: e.target.value })}
            placeholder="Dupont SPRL"
          />
          <Select
            label="Source"
            value={quickForm.source || ''}
            onChange={(e) => setQuickForm({ ...quickForm, source: e.target.value })}
          >
            <option value="">Sélectionner une source</option>
            {Object.entries(LEAD_SOURCE_LABELS).map(([key, label]) => (
              <option key={key} value={LEAD_SOURCES[key as keyof typeof LEAD_SOURCES]}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            label="Stage initial"
            value={quickForm.crm_stage || CRM_STAGES.PROSPECT}
            onChange={(e) => setQuickForm({ ...quickForm, crm_stage: e.target.value as any })}
          >
            {columns.map((col) => (
              <option key={col.id} value={col.slug}>
                {col.label}
              </option>
            ))}
          </Select>
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent"
              rows={3}
              value={quickForm.notes || ''}
              onChange={(e) => setQuickForm({ ...quickForm, notes: e.target.value })}
              placeholder="Informations supplémentaires..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setQuickOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleQuickCreate}
              isLoading={quickLoading}
              disabled={!quickForm.full_name || !quickForm.phone}
            >
              Créer le client
            </Button>
          </div>
        </div>
      </Modal>

      {/* Client Detail Modal */}
      {selectedClient && (
        <CrmClientModal
          client={selectedClient}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedClient(null);
          }}
          onUpdate={(updatedClient) => {
            setClients((prev) =>
              prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
            );
            setSelectedClient(updatedClient);
          }}
        />
      )}
    </>
  );
}
