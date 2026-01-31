"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createBrowserClient } from "@/lib/supabase/client";
import { CRM_STAGES, INDUSTRIES, COMPANY_SIZES, LEAD_SOURCES } from "@/lib/constants";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (clientId: string) => void;
}

export default function AddClientModal({
  isOpen,
  onClose,
  onSuccess,
}: AddClientModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    zip_code: "",
    city: "",
    country: "BE",
    crm_stage: "prospect",
    source: "",
    industry: "",
    company_size: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.phone) {
      toast.addToast("Le nom et le téléphone sont requis", "error");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from("clients")
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email || null,
            phone: formData.phone,
            company: formData.company || null,
            address: formData.address || null,
            zip_code: formData.zip_code || null,
            city: formData.city || null,
            country: formData.country || "BE",
            crm_stage: formData.crm_stage,
            source: formData.source || null,
            industry: formData.industry || null,
            company_size: formData.company_size || null,
            notes: formData.notes || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.addToast("Client créé avec succès !", "success");

      // Reset form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        zip_code: "",
        city: "",
        country: "BE",
        crm_stage: "prospect",
        source: "",
        industry: "",
        company_size: "",
        notes: "",
      });

      if (onSuccess && data) {
        onSuccess(data.id);
      }

      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
      toast.addToast("Erreur lors de la création du client", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter un nouveau client"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-semibold text-[#0f172a] mb-3">
            Informations de contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom complet *"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Jean Dupont"
              required
            />
            <Input
              label="Téléphone *"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+32 475 12 34 56"
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="jean@example.com"
            />
            <Input
              label="Entreprise"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="Nom de l'entreprise"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-semibold text-[#0f172a] mb-3">Adresse</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Adresse"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Rue de la Paix, 123"
              className="md:col-span-2"
            />
            <Input
              label="Code postal"
              value={formData.zip_code}
              onChange={(e) =>
                setFormData({ ...formData, zip_code: e.target.value })
              }
              placeholder="1000"
            />
            <Input
              label="Ville"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="Bruxelles"
            />
          </div>
        </div>

        {/* Business Info */}
        <div>
          <h3 className="text-sm font-semibold text-[#0f172a] mb-3">
            Informations entreprise
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Secteur d'activité"
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
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
              value={formData.company_size}
              onChange={(e) =>
                setFormData({ ...formData, company_size: e.target.value })
              }
            >
              <option value="">Sélectionner une taille</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} employés
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* CRM Info */}
        <div>
          <h3 className="text-sm font-semibold text-[#0f172a] mb-3">CRM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Stage CRM"
              value={formData.crm_stage}
              onChange={(e) =>
                setFormData({ ...formData, crm_stage: e.target.value })
              }
            >
              <option value="prospect">Prospect</option>
              <option value="proposal">Devis</option>
              <option value="closed_won">Gagné</option>
              <option value="closed_lost">Perdu</option>
            </Select>
            <Select
              label="Source"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
            >
              <option value="">Sélectionner une source</option>
              <option value="website">Site Web</option>
              <option value="cold_call">Cold Call</option>
              <option value="email">Email</option>
              <option value="linkedin">LinkedIn</option>
              <option value="referral">Référence</option>
              <option value="event">Événement</option>
              <option value="other">Autre</option>
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Notes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent"
            rows={3}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Notes internes sur ce client..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Créer le client
          </Button>
        </div>
      </form>
    </Modal>
  );
}
