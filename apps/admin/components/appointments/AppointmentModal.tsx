"use client";

import { useCallback, useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { AppointmentType, AppointmentFormData } from './types';
import { generateVideoLink, formatDuration } from '@/lib/videoLinks';

const APPOINTMENT_TYPES: { value: AppointmentType; label: string; icon: string }[] = [
  { value: 'demo', label: 'Démonstration', icon: '🎯' },
  { value: 'meeting', label: 'Réunion', icon: '🤝' },
  { value: 'call', label: 'Appel', icon: '📞' },
];

// Common time slots for quick selection
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const DURATIONS = [15, 30, 45, 60, 90, 120];

interface Client {
  id: string;
  full_name: string;
  company?: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedClient?: Client;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedClient,
}: AppointmentModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState<AppointmentFormData>({
    client_id: preselectedClient?.id || '',
    title: '',
    description: '',
    appointment_type: 'demo',
    scheduled_at: '',
    duration_minutes: 60,
    status: 'scheduled',
    is_remote: true,
    video_platform: 'meet',
    send_reminder_24h: true,
    send_reminder_1h: true,
  });

  // Separate date and time for easier input
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Reset form when modal opens with preselected client
  useEffect(() => {
    if (isOpen && preselectedClient) {
      setFormData(prev => ({
        ...prev,
        client_id: preselectedClient.id,
        title: `RDV avec ${preselectedClient.full_name}`,
      }));
    }
  }, [isOpen, preselectedClient]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await fetch('/api/clients');
      const data: { data?: Client[]; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch clients');
      }

      setClients(data.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !preselectedClient) {
      void fetchClients();
    }
  }, [isOpen, preselectedClient, fetchClients]);

  const handleCreate = async () => {
    if (!formData.client_id || !formData.title || !formData.scheduled_at) {
      toast.addToast('Veuillez remplir tous les champs requis', 'error');
      return;
    }

    setCreating(true);
    try {
      // Generate video link if remote
      let videoData = {};
      if (formData.is_remote && formData.video_platform) {
        const { link, meetingId } = generateVideoLink(
          formData.video_platform as any,
        );
        videoData = {
          video_link: link,
          video_platform: formData.video_platform,
          meeting_id: meetingId,
        };
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...videoData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create appointment');
      }

      toast.addToast('Rendez-vous créé avec succès', 'success');

      // Reset form
      setFormData({
        client_id: '',
        title: '',
        description: '',
        appointment_type: 'demo',
        scheduled_at: '',
        duration_minutes: 60,
        status: 'scheduled',
        is_remote: true,
        video_platform: 'meet',
        send_reminder_24h: true,
        send_reminder_1h: true,
      });
      setSelectedDate('');
      setSelectedTime('');

      onSuccess?.();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.addToast('Erreur lors de la création du rendez-vous', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      client_id: '',
      title: '',
      description: '',
      appointment_type: 'demo',
      scheduled_at: '',
      duration_minutes: 60,
      status: 'scheduled',
      is_remote: true,
      video_platform: 'meet',
      send_reminder_24h: true,
      send_reminder_1h: true,
    });
    setSelectedDate('');
    setSelectedTime('');
    onClose();
  };

  // Combine date and time into scheduled_at
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      setFormData({ ...formData, scheduled_at: `${date}T${selectedTime}` });
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      setFormData({ ...formData, scheduled_at: `${selectedDate}T${time}` });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Planifier un rendez-vous"
      size="lg"
    >
      <div className="space-y-4">
        <Input
          label="Titre *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Démo produit avec ACME Corp"
        />

        {preselectedClient ? (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Client: {preselectedClient.full_name}
              {preselectedClient.company && ` - ${preselectedClient.company}`}
            </p>
          </div>
        ) : (
          <Select
            label="Client *"
            value={formData.client_id}
            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name}{client.company ? ` - ${client.company}` : ''}
              </option>
            ))}
          </Select>
        )}

        <Select
          label="Type de rendez-vous"
          value={formData.appointment_type}
          onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value as any })}
        >
          {APPOINTMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </Select>

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Date *"
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1">
              Heure *
            </label>
            <select
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent bg-white"
              value={selectedTime}
              onChange={(e) => handleTimeChange(e.target.value)}
            >
              <option value="">Choisir l'heure</option>
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <Select
            label="Durée"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
          >
            {DURATIONS.map((duration) => (
              <option key={duration} value={duration}>
                {formatDuration(duration)}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_remote}
              onChange={(e) => setFormData({ ...formData, is_remote: e.target.checked })}
              className="w-4 h-4 text-[#b8860b] rounded focus:ring-[#b8860b]"
            />
            <span className="text-sm text-[#0f172a]">Rendez-vous en visio</span>
          </label>
        </div>

        {formData.is_remote && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              🎥 Le lien Google Meet sera généré automatiquement
            </p>
          </div>
        )}

        {!formData.is_remote && (
          <Input
            label="Lieu"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Adresse du rendez-vous"
          />
        )}

        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-1">
            Notes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent"
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notes pour le rendez-vous..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            isLoading={creating}
            disabled={!formData.client_id || !formData.title || !selectedDate || !selectedTime}
          >
            Créer le rendez-vous
          </Button>
        </div>
      </div>
    </Modal>
  );
}
