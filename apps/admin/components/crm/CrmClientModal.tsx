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
  Pencil,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import UnifiedQuoteModal from '@/components/quotes/UnifiedQuoteModal';
import AppointmentModal from '@/components/appointments/AppointmentModal';
import { CrmClient } from './types';
import {
  DEFAULT_CRM_COLUMNS,
  CALL_STATUS_LABELS,
  INDUSTRIES,
  COMPANY_SIZES,
  COMMUNICATION_PREFERENCES,
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
  // Section-specific edit modes
  const [editSections, setEditSections] = useState<{
    contact: boolean;
    business: boolean;
    communication: boolean;
    crmStatus: boolean;
    callStatus: boolean;
    relances: boolean;
    notes: boolean;
  }>({
    contact: false,
    business: false,
    communication: false,
    crmStatus: false,
    callStatus: false,
    relances: false,
    notes: false,
  });

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(client);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const toast = useToast();

  const toggleEditSection = (section: keyof typeof editSections) => {
    setEditSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const closeEditSection = (section: keyof typeof editSections) => {
    setEditSections(prev => ({ ...prev, [section]: false }));
    setFormData(client); // Reset form data for this section
  };

  const handleSave = async (section?: keyof typeof editSections) => {
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
      if (section) {
        setEditSections(prev => ({ ...prev, [section]: false }));
      }
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

  const handleProgressionChange = async (
    field: 'first_email_sent' | 'quote_sent' | 'meeting_scheduled' | 'follow_up_done',
    checked: boolean
  ) => {
    const dateField = `${field}_at` as keyof CrmClient;
    const updatedData = {
      ...formData,
      [field]: checked,
      [dateField]: checked ? new Date().toISOString() : undefined,
    };

    setFormData(updatedData);

    // Auto-save progression changes
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: checked,
          [dateField]: checked ? new Date().toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progression');
      }

      const data: { data?: CrmClient; error?: string } = await response.json();
      if (onUpdate && data.data) onUpdate(data.data);
      toast.addToast(checked ? '✅ Progression mise à jour' : '⏹️ Progression annulée', 'success');
    } catch (error) {
      console.error('Error updating progression:', error);
      toast.addToast('❌ Erreur lors de la mise à jour', 'error');
      // Revert change on error
      setFormData(formData);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
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
            onClick={() => setShowAppointmentModal(true)}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Informations de contact
                </h3>
                {!editSections.contact ? (
                  <button
                    onClick={() => toggleEditSection('contact')}
                    className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSave('contact')}
                      disabled={saving}
                      className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                      title="Sauvegarder"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => closeEditSection('contact')}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Annuler"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editSections.contact ? (
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Informations entreprise
                </h3>
                {!editSections.business ? (
                  <button
                    onClick={() => toggleEditSection('business')}
                    className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSave('business')}
                      disabled={saving}
                      className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                      title="Sauvegarder"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => closeEditSection('business')}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Annuler"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editSections.business ? (
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Préférences de communication
                </h3>
                {!editSections.communication ? (
                  <button
                    onClick={() => toggleEditSection('communication')}
                    className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSave('communication')}
                      disabled={saving}
                      className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                      title="Sauvegarder"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => closeEditSection('communication')}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Annuler"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editSections.communication ? (
                <Select
                  label="Canal préféré"
                  value={
                    formData.prefers_email ? 'email' :
                    formData.prefers_whatsapp ? 'whatsapp' :
                    formData.prefers_sms ? 'sms' : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      prefers_email: value === 'email',
                      prefers_whatsapp: value === 'whatsapp',
                      prefers_sms: value === 'sms',
                    });
                  }}
                >
                  <option value="">Aucune préférence</option>
                  <option value="email">📧 Email</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="sms">📱 SMS</option>
                </Select>
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0f172a]">📊 Statut CRM</h3>
                {!editSections.crmStatus ? (
                  <button
                    onClick={() => toggleEditSection('crmStatus')}
                    className="p-1.5 rounded-lg hover:bg-blue-100 text-[#64748b] hover:text-[#0f172a] transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSave('crmStatus')}
                      disabled={saving}
                      className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                      title="Sauvegarder"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => closeEditSection('crmStatus')}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Annuler"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editSections.crmStatus ? (
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  Statut d'appel
                </h3>
                {!editSections.callStatus ? (
                  <button
                    onClick={() => toggleEditSection('callStatus')}
                    className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSave('callStatus')}
                      disabled={saving}
                      className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                      title="Sauvegarder"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => closeEditSection('callStatus')}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Annuler"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editSections.callStatus ? (
                <div className="space-y-3">
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
                  />
                </div>
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
                  <p className="text-xs text-[#94a3b8] italic mt-2">
                    Suivi des appels téléphoniques avec ce client
                  </p>
                </div>
              )}
            </div>

            {/* Relances */}
            <div className="p-4 border-2 border-[#e2e8f0] rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0f172a]">🔔 Relances</h3>
                {!editSections.relances ? (
                  <button
                    onClick={() => toggleEditSection('relances')}
                    className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] transition-colors"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSave('relances')}
                      disabled={saving}
                      className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                      title="Sauvegarder"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => closeEditSection('relances')}
                      className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      title="Annuler"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editSections.relances ? (
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
              ) : (
                <div className="space-y-2">
                  {client.relance_1 || client.relance_2 || client.relance_3 ? (
                    <>
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
                    </>
                  ) : (
                    <span className="text-sm text-[#94a3b8]">Aucune relance programmée</span>
                  )}
                </div>
              )}
            </div>

            {/* Progress Tracker - Always interactive */}
            <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
              <h3 className="text-sm font-bold text-[#0f172a] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Progression client
              </h3>

              <div className="space-y-2">
                {/* 1er email */}
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 hover:bg-white/50 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.first_email_sent || false}
                    onChange={(e) => handleProgressionChange('first_email_sent', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <span className={formData.first_email_sent ? 'text-green-700 font-medium' : 'text-gray-500'}>
                    📧 1er email envoyé
                  </span>
                  {formData.first_email_sent && formData.first_email_sent_at && (
                    <span className="text-xs text-green-600 ml-auto">
                      {formatDate(formData.first_email_sent_at)}
                    </span>
                  )}
                </label>

                {/* Devis envoyé */}
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 hover:bg-white/50 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.quote_sent || false}
                    onChange={(e) => handleProgressionChange('quote_sent', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <span className={formData.quote_sent ? 'text-green-700 font-medium' : 'text-gray-500'}>
                    📄 Devis envoyé
                  </span>
                  {formData.quote_sent && formData.quote_sent_at && (
                    <span className="text-xs text-green-600 ml-auto">
                      {formatDate(formData.quote_sent_at)}
                    </span>
                  )}
                </label>

                {/* RDV planifié */}
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 hover:bg-white/50 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.meeting_scheduled || false}
                    onChange={(e) => handleProgressionChange('meeting_scheduled', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <span className={formData.meeting_scheduled ? 'text-green-700 font-medium' : 'text-gray-500'}>
                    📅 RDV planifié
                  </span>
                  {formData.meeting_scheduled && formData.meeting_scheduled_at && (
                    <span className="text-xs text-green-600 ml-auto">
                      {formatDate(formData.meeting_scheduled_at)}
                    </span>
                  )}
                </label>

                {/* Suivi effectué */}
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 hover:bg-white/50 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.follow_up_done || false}
                    onChange={(e) => handleProgressionChange('follow_up_done', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <span className={formData.follow_up_done ? 'text-green-700 font-medium' : 'text-gray-500'}>
                    ✅ Suivi effectué
                  </span>
                  {formData.follow_up_done && formData.follow_up_done_at && (
                    <span className="text-xs text-green-600 ml-auto">
                      {formatDate(formData.follow_up_done_at)}
                    </span>
                  )}
                </label>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-green-200">
                  <div className="flex items-center justify-between text-xs text-green-700 mb-2">
                    <span>Progression</span>
                    <span className="font-bold">
                      {Math.round((
                        [formData.first_email_sent, formData.quote_sent, formData.meeting_scheduled, formData.follow_up_done]
                          .filter(Boolean).length / 4
                      ) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(
                          [formData.first_email_sent, formData.quote_sent, formData.meeting_scheduled, formData.follow_up_done]
                            .filter(Boolean).length / 4
                        ) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Notes internes
            </h3>
            {!editSections.notes ? (
              <button
                onClick={() => toggleEditSection('notes')}
                className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172a] transition-colors"
                title="Modifier"
              >
                <Pencil className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSave('notes')}
                  disabled={saving}
                  className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                  title="Sauvegarder"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => closeEditSection('notes')}
                  className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                  title="Annuler"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {editSections.notes ? (
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
      <UnifiedQuoteModal
        client={client}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        onSuccess={() => {
          setShowQuoteModal(false);
          toast.addToast('✅ Devis créé et envoyé !', 'success');
        }}
        mode="quick-send"
      />

      {/* Appointment Creation Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        preselectedClient={{
          id: client.id,
          full_name: client.full_name,
          company: client.company,
        }}
        onSuccess={() => {
          setShowAppointmentModal(false);
          toast.addToast('✅ Rendez-vous planifié !', 'success');
          // Mark meeting_scheduled as true
          handleProgressionChange('meeting_scheduled', true);
        }}
      />
    </>
  );
}
