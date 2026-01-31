"use client";

import { useState } from 'react';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  Building2,
  MapPin,
  Edit2,
  Save,
  X,
  MessageSquare,
  PhoneCall,
  CheckCircle2,
  Circle,
  Trash2,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { QuickQuoteModal } from '@/components/quotes/QuickQuoteModal';
import { CrmClient } from './types';
import {
  DEFAULT_CRM_COLUMNS,
  CALL_STATUS_LABELS,
  INDUSTRIES,
  COMPANY_SIZES,
} from '@/lib/constants';

interface CrmClientModalProps {
  client: CrmClient;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (client: CrmClient) => void;
}

export default function CrmClientModal({
  client,
  isOpen,
  onClose,
  onUpdate,
}: CrmClientModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(client);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const toast = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      const data: { data?: CrmClient; error?: string } = await response.json();
      toast.addToast('✅ Client mis à jour', 'success');
      setEditMode(false);
      if (onUpdate && data.data) onUpdate(data.data);
    } catch (error) {
      console.error('Error updating client:', error);
      toast.addToast('❌ Erreur lors de la mise à jour', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCall = () => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = `tel:${client.phone}`;
    } else {
      navigator.clipboard.writeText(client.phone);
      toast.addToast('📱 Numéro copié', 'info');
    }
  };

  const handleEmail = () => {
    if (client.email) {
      window.location.href = `mailto:${client.email}`;
    }
  };

  const handleWhatsApp = () => {
    const phoneNumber = client.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const getStageBadgeColor = (stage: string) => {
    const column = DEFAULT_CRM_COLUMNS.find((col) => col.slug === stage);
    switch (column?.color) {
      case 'gray': return 'secondary';
      case 'yellow': return 'warning';
      case 'teal': return 'success';
      case 'red': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-BE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center justify-between w-full pr-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">{client.full_name}</h2>
                {client.company && (
                  <p className="text-sm text-[#64748b] font-normal">{client.company}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!editMode ? (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Edit2 className="w-4 h-4" />}
                  onClick={() => setEditMode(true)}
                >
                  Modifier
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSave}
                    isLoading={saving}
                  >
                    Sauvegarder
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X className="w-4 h-4" />}
                    onClick={() => {
                      setEditMode(false);
                      setFormData(client);
                    }}
                  >
                    Annuler
                  </Button>
                </>
              )}
            </div>
          </div>
        }
        size="3xl"
      >
        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2 flex-wrap p-4 bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] rounded-lg -mt-2 mb-6">
          <Button
            variant="secondary"
            size="sm"
            icon={<PhoneCall className="w-4 h-4" />}
            onClick={handleCall}
          >
            Appeler
          </Button>
          {client.email && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Mail className="w-4 h-4" />}
              onClick={handleEmail}
            >
              Email
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={handleWhatsApp}
          >
            WhatsApp
          </Button>
          <div className="flex-1"></div>
          <Button
            variant="primary"
            size="sm"
            icon={<Calendar className="w-4 h-4" />}
          >
            Planifier RDV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FileText className="w-4 h-4" />}
            onClick={() => setShowQuoteModal(true)}
          >
            Créer devis
          </Button>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - Client Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="p-4 border-2 border-[#e2e8f0] rounded-lg">
              <h3 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Informations de contact
              </h3>

              {editMode ? (
                <div className="space-y-3">
                  <Input
                    label="Nom complet"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                  <Input
                    label="Téléphone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Input
                    label="Entreprise"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748b]">Téléphone</span>
                    <a
                      href={`tel:${client.phone}`}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                  {client.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">Email</span>
                      <a
                        href={`mailto:${client.email}`}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        {client.email}
                      </a>
                    </div>
                  )}
                  {client.company && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">Entreprise</span>
                      <span className="text-sm font-semibold text-[#0f172a]">{client.company}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Business Information */}
            <div className="p-4 border-2 border-[#e2e8f0] rounded-lg">
              <h3 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Informations entreprise
              </h3>

              {editMode ? (
                <div className="space-y-3">
                  <Select
                    label="Secteur d'activité"
                    value={formData.industry || ''}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value as any })}
                  >
                    <option value="">Sélectionner</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </Select>
                  <Select
                    label="Taille entreprise"
                    value={formData.company_size || ''}
                    onChange={(e) => setFormData({ ...formData, company_size: e.target.value as any })}
                  >
                    <option value="">Sélectionner</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size}>{size} employés</option>
                    ))}
                  </Select>
                  <Input
                    label="Source"
                    value={formData.source || ''}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="Ex: LinkedIn, Site web, etc."
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {client.industry && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">Secteur</span>
                      <Badge variant="accent">{client.industry}</Badge>
                    </div>
                  )}
                  {client.company_size && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">Taille</span>
                      <span className="text-sm font-semibold">{client.company_size} employés</span>
                    </div>
                  )}
                  {client.source && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">Source</span>
                      <Badge variant="secondary">{client.source}</Badge>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Communication Preferences */}
            <div className="p-4 border-2 border-[#e2e8f0] rounded-lg">
              <h3 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Préférences de communication
              </h3>

              {editMode ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.prefers_email || false}
                      onChange={(e) => setFormData({ ...formData, prefers_email: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">📧 Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.prefers_whatsapp || false}
                      onChange={(e) => setFormData({ ...formData, prefers_whatsapp: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">💬 WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.prefers_sms || false}
                      onChange={(e) => setFormData({ ...formData, prefers_sms: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">📱 SMS</span>
                  </label>
                </div>
              ) : (
                <div className="flex gap-2">
                  {client.prefers_email && <Badge variant="secondary">📧 Email</Badge>}
                  {client.prefers_whatsapp && <Badge variant="secondary">💬 WhatsApp</Badge>}
                  {client.prefers_sms && <Badge variant="secondary">📱 SMS</Badge>}
                  {!client.prefers_email && !client.prefers_whatsapp && !client.prefers_sms && (
                    <span className="text-sm text-[#94a3b8]">Aucune préférence définie</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Status & Actions */}
          <div className="space-y-6">
            {/* CRM Status */}
            <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-bold text-[#0f172a] mb-4">📊 Statut CRM</h3>

              {editMode ? (
                <Select
                  label="Stage actuel"
                  value={formData.crm_stage}
                  onChange={(e) => setFormData({ ...formData, crm_stage: e.target.value as any })}
                >
                  {DEFAULT_CRM_COLUMNS.map((col) => (
                    <option key={col.id} value={col.slug}>{col.label}</option>
                  ))}
                </Select>
              ) : (
                <div className="flex items-center justify-center p-4 bg-white rounded-lg">
                  <Badge variant={getStageBadgeColor(client.crm_stage)} className="text-lg px-4 py-2">
                    {DEFAULT_CRM_COLUMNS.find((col) => col.slug === client.crm_stage)?.label || client.crm_stage}
                  </Badge>
                </div>
              )}
            </div>

            {/* Call Status */}
            <div className="p-4 border-2 border-[#e2e8f0] rounded-lg">
              <h3 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-600" />
                Statut d'appel
              </h3>

              {editMode ? (
                <>
                  <Select
                    label="Statut"
                    value={formData.call_status || ''}
                    onChange={(e) => setFormData({ ...formData, call_status: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    {Object.entries(CALL_STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key.toLowerCase()}>
                        {label}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Date prochain appel"
                    type="date"
                    value={formData.next_callback_date || ''}
                    onChange={(e) => setFormData({ ...formData, next_callback_date: e.target.value })}
                    className="mt-3"
                  />
                </>
              ) : (
                <div className="space-y-2">
                  {client.call_status ? (
                    <Badge variant="secondary">
                      {CALL_STATUS_LABELS[client.call_status.toUpperCase() as keyof typeof CALL_STATUS_LABELS] || client.call_status}
                    </Badge>
                  ) : (
                    <span className="text-sm text-[#94a3b8]">Aucun appel</span>
                  )}
                  {client.next_callback_date && (
                    <div className="text-sm text-[#64748b]">
                      Prochain appel: {formatDate(client.next_callback_date)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Relances */}
            {editMode && (
              <div className="p-4 border-2 border-[#e2e8f0] rounded-lg">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">🔔 Relances</h3>
                <div className="space-y-3">
                  <Input
                    label="Relance 1"
                    value={formData.relance_1 || ''}
                    onChange={(e) => setFormData({ ...formData, relance_1: e.target.value })}
                    placeholder="Date ou note"
                  />
                  <Input
                    label="Relance 2"
                    value={formData.relance_2 || ''}
                    onChange={(e) => setFormData({ ...formData, relance_2: e.target.value })}
                    placeholder="Date ou note"
                  />
                  <Input
                    label="Relance 3"
                    value={formData.relance_3 || ''}
                    onChange={(e) => setFormData({ ...formData, relance_3: e.target.value })}
                    placeholder="Date ou note"
                  />
                </div>
              </div>
            )}

            {!editMode && (client.relance_1 || client.relance_2 || client.relance_3) && (
              <div className="p-4 border-2 border-[#e2e8f0] rounded-lg">
                <h3 className="text-sm font-bold text-[#0f172a] mb-3">🔔 Relances</h3>
                <div className="space-y-2">
                  {client.relance_1 && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {client.relance_1}
                    </div>
                  )}
                  {client.relance_2 && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {client.relance_2}
                    </div>
                  )}
                  {client.relance_3 && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {client.relance_3}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity Stats */}
            <div className="p-4 border-2 border-[#e2e8f0] rounded-lg bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
              <h3 className="text-sm font-bold text-[#0f172a] mb-4">📈 Activité</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {client.appointments_count || 0}
                  </div>
                  <div className="text-xs text-[#64748b] mt-1">Rendez-vous</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-[#b8860b]">
                    {client.quotes_count || 0}
                  </div>
                  <div className="text-xs text-[#64748b] mt-1">Devis</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-[#64748b] text-center">
                Créé le {formatDate(client.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section - Full Width */}
        <div className="mt-6 p-4 border-2 border-[#e2e8f0] rounded-lg">
          <h3 className="text-sm font-bold text-[#0f172a] mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Notes internes
          </h3>
          {editMode ? (
            <textarea
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ajoutez des notes sur ce client..."
            />
          ) : (
            <div className="p-4 bg-[#f1f5f9] rounded-lg text-sm text-[#0f172a] min-h-[120px]">
              {client.notes || <span className="text-[#64748b] italic">Aucune note</span>}
            </div>
          )}
        </div>
      </Modal>

      {/* Quote Creation Modal */}
      <QuickQuoteModal
        client={client}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        onSuccess={() => {
          setShowQuoteModal(false);
          toast.addToast('✅ Devis créé et envoyé !', 'success');
        }}
      />
    </>
  );
}
