"use client";

import { useState } from 'react';
import {
  Phone,
  Mail,
  Calendar,
  FileText,
  Building2,
  MapPin,
  Tag,
  Clock,
  User,
  Edit2,
  Save,
  X,
  MessageSquare,
  PhoneCall,
  Video,
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
  CRM_STAGES,
  DEFAULT_CRM_COLUMNS,
  LEAD_SOURCE_LABELS,
  CALL_STATUS,
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
      toast.addToast('Client mis à jour', 'success');
      setEditMode(false);
      if (onUpdate && data.data) onUpdate(data.data);
    } catch (error) {
      console.error('Error updating client:', error);
      toast.addToast('Erreur lors de la mise à jour', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCallAction = () => {
    // Open phone dialer if on mobile, or copy number
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.location.href = `tel:${client.phone}`;
    } else {
      navigator.clipboard.writeText(client.phone);
      toast.addToast('Numéro copié dans le presse-papier', 'info');
    }
  };

  const handleEmailAction = () => {
    if (client.email) {
      window.location.href = `mailto:${client.email}`;
    }
  };

  const handleWhatsAppAction = () => {
    const phoneNumber = client.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleScheduleAppointment = () => {
    // TODO: Open appointment creation modal
    toast.addToast('Création de RDV bientôt disponible', 'info');
  };

  const handleCreateQuote = () => {
    if (!client.email) {
      toast.addToast('Le client doit avoir un email pour créer un devis', 'warning');
      return;
    }
    setShowQuoteModal(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-BE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStageBadgeColor = (stage: string) => {
    const column = DEFAULT_CRM_COLUMNS.find((col) => col.slug === stage);
    switch (column?.color) {
      case 'gray': return 'secondary';
      case 'blue': return 'primary';
      case 'purple': return 'accent';
      case 'yellow': return 'warning';
      case 'teal': return 'success';
      case 'red': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-[#1e3a8a]" />
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">{client.full_name}</h2>
            {client.company && (
              <p className="text-sm text-[#64748b] font-normal">{client.company}</p>
            )}
          </div>
        </div>
      }
      size="xl"
    >
      <div className="space-y-6">
        {/* Quick Actions Bar */}
        <div className="flex items-center gap-2 flex-wrap p-4 bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] rounded-lg">
          <Button
            variant="secondary"
            size="sm"
            icon={<PhoneCall className="w-4 h-4" />}
            onClick={handleCallAction}
          >
            Appeler
          </Button>
          {client.email && (
            <Button
              variant="secondary"
              size="sm"
              icon={<Mail className="w-4 h-4" />}
              onClick={handleEmailAction}
            >
              Email
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={handleWhatsAppAction}
          >
            WhatsApp
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Calendar className="w-4 h-4" />}
            onClick={handleScheduleAppointment}
          >
            Planifier RDV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<FileText className="w-4 h-4" />}
            onClick={handleCreateQuote}
          >
            Créer devis
          </Button>
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

        {/* Main Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations de contact
            </h3>

            {editMode ? (
              <>
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
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[#64748b]" />
                  <a
                    href={`tel:${client.phone}`}
                    className="text-[#1e3a8a] hover:underline font-medium"
                  >
                    {client.phone}
                  </a>
                </div>
                {client.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-[#64748b]" />
                    <a
                      href={`mailto:${client.email}`}
                      className="text-[#1e3a8a] hover:underline"
                    >
                      {client.email}
                    </a>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-[#64748b]" />
                    <span className="text-[#0f172a]">{client.company}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-[#64748b]" />
                    <span className="text-[#0f172a]">
                      {client.address}
                      {client.city && `, ${client.city}`}
                      {client.zip_code && ` ${client.zip_code}`}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Informations entreprise
            </h3>

            {editMode ? (
              <>
                <Select
                  label="Secteur d'activité"
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value as any })}
                >
                  <option value="">Sélectionner un secteur</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Taille entreprise"
                  value={formData.company_size || ''}
                  onChange={(e) => setFormData({ ...formData, company_size: e.target.value as any })}
                >
                  <option value="">Sélectionner une taille</option>
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size} employés
                    </option>
                  ))}
                </Select>
              </>
            ) : (
              <div className="space-y-3">
                {client.industry && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#64748b]">Secteur:</span>
                    <Badge variant="accent">{client.industry}</Badge>
                  </div>
                )}
                {client.company_size && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#64748b]">Taille:</span>
                    <Badge variant="secondary">{client.company_size} employés</Badge>
                  </div>
                )}
                {client.source && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#64748b]">Source:</span>
                    <Badge variant="secondary">
                      {LEAD_SOURCE_LABELS[client.source.toUpperCase() as keyof typeof LEAD_SOURCE_LABELS] || client.source}
                    </Badge>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CRM Stage and Call Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            {editMode ? (
              <Select
                label="Stage CRM"
                value={formData.crm_stage}
                onChange={(e) => setFormData({ ...formData, crm_stage: e.target.value as any })}
              >
                {DEFAULT_CRM_COLUMNS.map((col) => (
                  <option key={col.id} value={col.slug}>
                    {col.label}
                  </option>
                ))}
              </Select>
            ) : (
              <div>
                <span className="text-sm text-[#64748b] block mb-2">Stage actuel</span>
                <Badge variant={getStageBadgeColor(client.crm_stage)}>
                  {DEFAULT_CRM_COLUMNS.find((col) => col.slug === client.crm_stage)?.label || client.crm_stage}
                </Badge>
              </div>
            )}
          </div>

          <div>
            {editMode ? (
              <Select
                label="Statut d'appel"
                value={formData.call_status || ''}
                onChange={(e) => setFormData({ ...formData, call_status: e.target.value })}
              >
                <option value="">Sélectionner un statut</option>
                {Object.entries(CALL_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={CALL_STATUS[key as keyof typeof CALL_STATUS]}>
                    {label}
                  </option>
                ))}
              </Select>
            ) : (
              <div>
                <span className="text-sm text-[#64748b] block mb-2">Statut d'appel</span>
                {client.call_status ? (
                  <Badge variant="secondary">
                    {CALL_STATUS_LABELS[
                      Object.keys(CALL_STATUS).find(
                        (key) => CALL_STATUS[key as keyof typeof CALL_STATUS] === client.call_status
                      ) as keyof typeof CALL_STATUS
                    ] || client.call_status}
                  </Badge>
                ) : (
                  <span className="text-sm text-[#64748b]">Aucun appel</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Notes internes
          </label>
          {editMode ? (
            <textarea
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent min-h-[100px]"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ajoutez des notes sur ce client..."
            />
          ) : (
            <div className="p-4 bg-[#f1f5f9] rounded-lg text-sm text-[#0f172a] min-h-[100px]">
              {client.notes || <span className="text-[#64748b] italic">Aucune note</span>}
            </div>
          )}
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#1e3a8a]">
              {client.appointments_count || 0}
            </div>
            <div className="text-xs text-[#64748b] mt-1">Rendez-vous</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#b8860b]">
              {client.quotes_count || 0}
            </div>
            <div className="text-xs text-[#64748b] mt-1">Devis envoyés</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[#64748b]">Créé le</div>
            <div className="text-sm font-medium text-[#0f172a] mt-1">
              {formatDate(client.created_at)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[#64748b]">Mis à jour</div>
            <div className="text-sm font-medium text-[#0f172a] mt-1">
              {formatDate(client.updated_at)}
            </div>
          </div>
        </div>

        {/* Tracking ID */}
        {client.tracking_id && (
          <div className="text-center p-2 bg-[#f1f5f9] rounded-lg">
            <span className="text-xs text-[#64748b]">ID de suivi:</span>{' '}
            <span className="text-sm font-mono font-semibold text-[#0f172a]">
              #{String(client.tracking_id).padStart(4, '0')}
            </span>
          </div>
        )}
      </div>
    </Modal>

    {/* Quote Creation Modal */}
    <QuickQuoteModal
      client={client}
      isOpen={showQuoteModal}
      onClose={() => setShowQuoteModal(false)}
      onSuccess={(quoteId) => {
        setShowQuoteModal(false);
        toast.addToast('Devis créé et envoyé !', 'success');
      }}
    />
  </>
  );
}
