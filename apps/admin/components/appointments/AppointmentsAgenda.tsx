"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Plus,
  Search,
  User,
  Copy,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import AppointmentModal from './AppointmentModal';
import { Appointment, AppointmentStatus, AppointmentType } from './types';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  formatDuration,
  isUpcoming,
  isPast,
  getVideoPlatformName,
} from '@/lib/videoLinks';

// Note: Input is used in filters section

const APPOINTMENT_TYPES: { value: AppointmentType; label: string; icon: string }[] = [
  { value: 'consultation', label: 'Consultation', icon: '💬' },
  { value: 'demo', label: 'Démonstration', icon: '🎯' },
  { value: 'meeting', label: 'Réunion', icon: '🤝' },
  { value: 'call', label: 'Appel', icon: '📞' },
  { value: 'video', label: 'Visio', icon: '🎥' },
  { value: 'onsite', label: 'Sur site', icon: '🏢' },
];

export default function AppointmentsAgenda() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<AppointmentType | ''>('');
  const toast = useToast();

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments');
      const data: { data?: Appointment[]; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch appointments');
      }

      setAppointments(data.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.addToast('Erreur lors du chargement des rendez-vous', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        const matchesSearch =
          apt.title.toLowerCase().includes(search.toLowerCase()) ||
          apt.client_name?.toLowerCase().includes(search.toLowerCase()) ||
          apt.client_company?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? apt.status === statusFilter : true;
        const matchesType = typeFilter ? apt.appointment_type === typeFilter : true;
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  }, [appointments, search, statusFilter, typeFilter]);

  // Group appointments by date
  const groupedAppointments = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};

    filteredAppointments.forEach((apt) => {
      const date = formatAppointmentDate(apt.scheduled_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(apt);
    });

    return groups;
  }, [filteredAppointments]);

  const copyVideoLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.addToast('Lien copié dans le presse-papier', 'success');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Planifié</Badge>;
      case 'confirmed':
        return <Badge variant="primary">Confirmé</Badge>;
      case 'in_progress':
        return <Badge variant="warning">En cours</Badge>;
      case 'completed':
        return <Badge variant="success">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="danger">Annulé</Badge>;
      case 'no_show':
        return <Badge variant="danger">Absent</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: AppointmentType) => {
    return APPOINTMENT_TYPES.find((t) => t.value === type)?.icon || '📅';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a8a]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] bg-clip-text text-transparent">
              Agenda des rendez-vous
            </h1>
            <p className="text-sm text-[#64748b] mt-1">
              Gérez vos rendez-vous avec liens visio automatiques
            </p>
          </div>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setCreateModalOpen(true)}
          >
            Nouveau rendez-vous
          </Button>
        </div>

        {/* Filters */}
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
            <option value="">Tous les statuts</option>
            <option value="scheduled">Planifié</option>
            <option value="confirmed">Confirmé</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
            <option value="">Tous les types</option>
            {APPOINTMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Agenda View */}
        <div className="space-y-6">
          {Object.keys(groupedAppointments).length === 0 ? (
            <div className="text-center py-12 bg-[#f1f5f9] rounded-lg">
              <Calendar className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
              <p className="text-[#64748b]">Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            Object.entries(groupedAppointments).map(([date, apts]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#1e3a8a]" />
                  {date}
                </h3>
                <div className="space-y-2">
                  {apts.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setDetailModalOpen(true);
                      }}
                      className={`p-4 rounded-lg border cursor-pointer transition hover:shadow-md ${
                        isUpcoming(apt.scheduled_at)
                          ? 'border-[#b8860b] bg-gradient-to-r from-amber-50 to-yellow-50'
                          : isPast(apt.scheduled_at)
                          ? 'border-[#e2e8f0] bg-gray-50'
                          : 'border-[#e2e8f0] bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 text-center">
                          <div className="text-2xl">{getTypeIcon(apt.appointment_type)}</div>
                          <div className="text-sm font-semibold text-[#0f172a] mt-1">
                            {formatAppointmentTime(apt.scheduled_at)}
                          </div>
                          <div className="text-xs text-[#64748b]">
                            {formatDuration(apt.duration_minutes)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-base font-semibold text-[#0f172a]">
                              {apt.title}
                            </h4>
                            {getStatusBadge(apt.status)}
                          </div>

                          <div className="mt-2 space-y-1">
                            {apt.client_name && (
                              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                                <User className="w-3 h-3" />
                                <span>{apt.client_name}</span>
                                {apt.client_company && (
                                  <span className="text-xs">({apt.client_company})</span>
                                )}
                              </div>
                            )}

                            {apt.is_remote && apt.video_link && (
                              <div className="flex items-center gap-2 text-sm">
                                <Video className="w-3 h-3 text-[#1e3a8a]" />
                                <a
                                  href={apt.video_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[#1e3a8a] hover:underline"
                                >
                                  {getVideoPlatformName(apt.video_platform)}
                                </a>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyVideoLink(apt.video_link!);
                                  }}
                                  className="text-[#64748b] hover:text-[#0f172a]"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {apt.location && !apt.is_remote && (
                              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                                <MapPin className="w-3 h-3" />
                                <span>{apt.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {isUpcoming(apt.scheduled_at) && (
                          <div className="flex-shrink-0">
                            <Badge variant="warning">Bientôt</Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Modal - Using shared component */}
      <AppointmentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          void fetchAppointments();
        }}
      />

      {/* Detail Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={selectedAppointment.title}
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-[#64748b]">Détails du rendez-vous (TODO: Compléter)</p>
            <pre className="text-xs bg-[#f1f5f9] p-4 rounded-lg overflow-auto">
              {JSON.stringify(selectedAppointment, null, 2)}
            </pre>
          </div>
        </Modal>
      )}
    </>
  );
}
