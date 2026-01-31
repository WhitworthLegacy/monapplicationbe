"use client";

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Send, Package as PackageIcon } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { createBrowserClient } from '@/lib/supabase/client';
import QuotePreviewModal from './QuotePreviewModal';
import {
  PACKAGES,
  PACKS,
  getPackageById,
  getPackById,
  generateQuoteDescription,
  calculatePackagePrice,
  type Package,
  type Pack,
} from '@/lib/constants/packages';

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number; // in cents
}

interface Client {
  id: string;
  full_name: string;
  company?: string;
  email?: string;
  phone?: string;
}

interface UnifiedQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (quoteId?: string) => void;
  client?: Client; // If provided, pre-fill client and quick-send mode
  mode?: 'create' | 'quick-send'; // create = save to DB, quick-send = send via email directly
}

interface SavedQuote {
  id: string;
  quote_number: string;
}

export default function UnifiedQuoteModal({
  isOpen,
  onClose,
  onSuccess,
  client: preSelectedClient,
  mode = 'create',
}: UnifiedQuoteModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(preSelectedClient || null);
  const [selectedPack, setSelectedPack] = useState<string>('');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([
    { description: '', quantity: 1, unit_price: 0 },
  ]);
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(21);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedQuote, setSavedQuote] = useState<SavedQuote | null>(null);
  const toast = useToast();

  // Fetch clients if not in quick-send mode
  useEffect(() => {
    if (!preSelectedClient && isOpen) {
      fetchClients();
    }
  }, [preSelectedClient, isOpen]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      const data: { data?: Client[]; error?: string } = await response.json();
      if (data.data) {
        setClients(data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  // Auto-fill when pack is selected
  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId);
    if (!packId) {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
      setDescription('');
      setTitle('');
      return;
    }

    const pack = getPackById(packId);
    if (!pack) return;

    // Auto-fill title
    setTitle(`Pack ${pack.name}`);

    // Auto-fill description
    const desc = generateQuoteDescription(packId);
    setDescription(desc);

    // Auto-fill items based on packages in the pack
    // Special handling for FULL pack with discount
    if (packId === 'full') {
      const packageItems: QuoteItem[] = pack.packageIds.map((packageId) => {
        const pkg = getPackageById(packageId);
        if (!pkg) return { description: '', quantity: 1, unit_price: 0 };

        return {
          description: `${pkg.name} - ${pkg.description}`,
          quantity: 1,
          unit_price: pkg.price,
        };
      });

      // Add discount line
      packageItems.push({
        description: 'Réduction Pack FULL',
        quantity: 1,
        unit_price: -100000, // -1000€ in cents
      });

      setItems(packageItems);
    } else {
      const packageItems: QuoteItem[] = pack.packageIds.map((packageId) => {
        const pkg = getPackageById(packageId);
        if (!pkg) return { description: '', quantity: 1, unit_price: 0 };

        return {
          description: `${pkg.name} - ${pkg.description}`,
          quantity: 1,
          unit_price: pkg.price,
        };
      });

      setItems(packageItems);
    }

    setSelectedPackages(pack.packageIds);
  };

  // Auto-fill when individual packages are selected
  const handlePackagesSelect = (packageIds: string[]) => {
    setSelectedPackages(packageIds);
    if (packageIds.length === 0) {
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
      setDescription('');
      setTitle('');
      return;
    }

    // Auto-fill title
    const packageNames = packageIds
      .map((id) => getPackageById(id)?.name)
      .filter(Boolean)
      .join(' + ');
    setTitle(`Modules: ${packageNames}`);

    // Auto-fill description
    const desc = generateQuoteDescription(undefined, packageIds);
    setDescription(desc);

    // Auto-fill items
    const packageItems: QuoteItem[] = packageIds.map((packageId) => {
      const pkg = getPackageById(packageId);
      if (!pkg) return { description: '', quantity: 1, unit_price: 0 };

      return {
        description: `${pkg.name} - ${pkg.description}`,
        quantity: 1,
        unit_price: pkg.price,
      };
    });

    setItems(packageItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.addToast('Au moins une ligne requise', 'warning');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleGeneratePreview = async () => {
    // Validation
    const client = preSelectedClient || selectedClient;
    if (!client) {
      toast.addToast('Veuillez sélectionner un client', 'error');
      return;
    }

    if (!title.trim()) {
      toast.addToast('Le titre est requis', 'error');
      return;
    }

    const invalidItems = items.filter((item) => !item.description.trim());
    if (invalidItems.length > 0) {
      toast.addToast('Toutes les lignes doivent avoir une description', 'error');
      return;
    }

    setLoading(true);

    try {
      // First, create draft quote in database to get quote_number
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          title,
          description,
          items: items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            line_total: item.quantity * item.unit_price,
            position: index,
          })),
          tax_rate: taxRate,
          status: 'draft',
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.data) {
        throw new Error(data.error || 'Erreur lors de la création du devis');
      }

      // Store the saved quote info (id and quote_number)
      setSavedQuote({
        id: data.data.id,
        quote_number: data.data.quote_number,
      });

      // Open preview modal
      setShowPreview(true);
    } catch (error) {
      console.error('Error creating draft quote:', error);
      toast.addToast('❌ Erreur lors de la création du devis', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (pdfBlob: Blob) => {
    const client = preSelectedClient || selectedClient;
    if (!client || !client.email) {
      toast.addToast('Le client n\'a pas d\'email', 'error');
      return;
    }

    if (!savedQuote) {
      toast.addToast('Erreur: devis non sauvegardé', 'error');
      return;
    }

    setLoading(true);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(pdfBlob);
      });

      const pdfBase64 = await base64Promise;

      const response = await fetch('/api/quotes/quick-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_id: savedQuote.id,
          quote_number: savedQuote.quote_number,
          client_id: client.id,
          client_name: client.full_name,
          client_email: client.email,
          client_company: client.company,
          client_phone: client.phone,
          title,
          description,
          items: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
          notes,
          tax_rate: taxRate,
          pdf_base64: pdfBase64,
        }),
      });

      const data: { success?: boolean; error?: string } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      toast.addToast('✅ Devis envoyé avec succès !', 'success');
      setShowPreview(false);
      resetForm();
      onClose();
      if (onSuccess) onSuccess(savedQuote.id);
    } catch (error) {
      console.error('Error sending quote:', error);
      toast.addToast('❌ Erreur lors de l\'envoi du devis', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedClient(null);
    setSelectedPack('');
    setSelectedPackages([]);
    setTitle('');
    setDescription('');
    setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    setNotes('');
    setTaxRate(21);
    setSavedQuote(null);
  };

  const { subtotal, taxAmount, total } = calculateTotal();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">
              {mode === 'quick-send' ? 'Envoyer un devis' : 'Créer un devis'}
            </h2>
            {preSelectedClient && (
              <p className="text-sm text-[#64748b] font-normal">
                Pour {preSelectedClient.full_name}
              </p>
            )}
          </div>
        </div>
      }
      size="3xl"
    >
      <div className="space-y-6">
        {/* Client Selection (only if not pre-selected) */}
        {!preSelectedClient && (
          <div>
            <Select
              label="Client *"
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find((c) => c.id === e.target.value);
                setSelectedClient(client || null);
              }}
              required
            >
              <option value="">Sélectionner un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                  {client.company ? ` - ${client.company}` : ''}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Pack Selection */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <PackageIcon className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-[#0f172a]">
              Sélection rapide par pack
            </h3>
          </div>

          <Select
            label="Choisir un pack pré-configuré"
            value={selectedPack}
            onChange={(e) => handlePackSelect(e.target.value)}
          >
            <option value="">Personnalisé (créer manuellement)</option>
            {PACKS.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name} - {pack.priceLabel} - {pack.description}
                {pack.popular ? ' ⭐ POPULAIRE' : ''}
                {pack.savings ? ` 💚 ${pack.savings}` : ''}
              </option>
            ))}
          </Select>

          <p className="text-xs text-blue-600 mt-2">
            💡 Sélectionner un pack remplira automatiquement le titre, la description et les lignes du devis
          </p>
        </div>

        {/* Title & Description */}
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Titre du devis *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Pack FONDATIONS - Secrétaire digitale"
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description détaillée du devis..."
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-[#0f172a]">
              Lignes du devis
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4 mr-1" />
              Ajouter une ligne
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 p-3 border border-[#e2e8f0] rounded-lg bg-white hover:border-blue-300 transition-colors"
              >
                <div className="col-span-5">
                  <Input
                    placeholder="Description *"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, 'description', e.target.value)
                    }
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    placeholder="Quantité"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, 'quantity', Number(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Prix unitaire €"
                    min="0"
                    step="0.01"
                    value={item.unit_price / 100}
                    onChange={(e) =>
                      updateItem(
                        index,
                        'unit_price',
                        Math.round(Number(e.target.value) * 100)
                      )
                    }
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600">
                    {((item.quantity * item.unit_price) / 100).toFixed(2)} €
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-[#e2e8f0] pt-4">
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">Sous-total HT:</span>
                <span className="font-semibold">
                  {(subtotal / 100).toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-[#64748b]">TVA:</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-20 text-right"
                  />
                  <span>%</span>
                  <span className="font-semibold w-24 text-right">
                    {(taxAmount / 100).toFixed(2)} €
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-[#e2e8f0] pt-2">
                <span>Total TTC:</span>
                <span className="text-[#1e3a8a]">
                  {(total / 100).toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Notes internes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes visibles uniquement par vous..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleGeneratePreview}
            isLoading={loading}
            icon={<FileText className="w-4 h-4" />}
          >
            Générer devis
          </Button>
        </div>
      </div>

      {/* Quote Preview Modal */}
      {showPreview && (preSelectedClient || selectedClient) && (
        <QuotePreviewModal
          open={showPreview}
          onClose={() => {
            setShowPreview(false);
            // If closing without sending, the draft quote remains in DB
          }}
          data={{
            quoteNumber: savedQuote?.quote_number,
            clientName: (preSelectedClient || selectedClient)?.full_name || '',
            clientEmail: (preSelectedClient || selectedClient)?.email,
            clientPhone: (preSelectedClient || selectedClient)?.phone,
            clientCompany: (preSelectedClient || selectedClient)?.company,
            title,
            description,
            items,
            notes,
            taxRate,
            validDays: 30,
          }}
          onSendEmail={handleSendEmail}
        />
      )}
    </Modal>
  );
}
