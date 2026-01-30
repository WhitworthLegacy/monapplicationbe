"use client";

import { useState } from 'react';
import { FileText, Plus, Trash2, Send } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import type { CrmClient } from '../crm/types';

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number; // in euros (will be converted to cents)
}

interface QuickQuoteModalProps {
  client: CrmClient;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (quoteId: string) => void;
}

export function QuickQuoteModal({
  client,
  isOpen,
  onClose,
  onSuccess,
}: QuickQuoteModalProps) {
  const [items, setItems] = useState<QuoteItem[]>([
    { description: '', quantity: 1, unit_price: 0 },
  ]);
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const toast = useToast();

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) {
      toast.addToast('Au moins un article requis', 'warning');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const tax = subtotal * 0.21; // 21% TVA
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const handleSend = async () => {
    // Validation
    const invalidItems = items.filter(
      (item) => !item.description.trim() || item.unit_price <= 0
    );

    if (invalidItems.length > 0) {
      toast.addToast('Veuillez remplir tous les articles', 'error');
      return;
    }

    if (!client.email) {
      toast.addToast('Le client n\'a pas d\'email', 'error');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/quotes/quick-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: client.id,
          client_name: client.full_name,
          client_email: client.email,
          client_company: client.company,
          client_phone: client.phone,
          items: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: Math.round(item.unit_price * 100), // Convert to cents
          })),
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      toast.addToast('Devis envoyé avec succès !', 'success');
      if (onSuccess) onSuccess(data.data.invoiceId);
      onClose();

      // Reset form
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
      setNotes('');
    } catch (error) {
      console.error('Error sending quote:', error);
      toast.addToast(
        error instanceof Error ? error.message : 'Erreur lors de l\'envoi du devis',
        'error'
      );
    } finally {
      setSending(false);
    }
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#1e3a8a]" />
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">Créer un devis</h2>
            <p className="text-sm text-[#64748b] font-normal">
              Pour {client.full_name}
              {client.company && ` - ${client.company}`}
            </p>
          </div>
        </div>
      }
      size="xl"
    >
      <div className="space-y-6">
        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-[#0f172a]">
              Articles
            </label>
            <Button
              variant="ghost"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={addItem}
            >
              Ajouter un article
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 p-3 bg-[#f1f5f9] rounded-lg"
              >
                <div className="col-span-12 md:col-span-5">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, 'description', e.target.value)
                    }
                  />
                </div>
                <div className="col-span-5 md:col-span-2">
                  <Input
                    type="number"
                    placeholder="Qté"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, 'quantity', parseInt(e.target.value) || 0)
                    }
                    min="1"
                  />
                </div>
                <div className="col-span-5 md:col-span-3">
                  <Input
                    type="number"
                    placeholder="Prix unitaire €"
                    value={item.unit_price}
                    onChange={(e) =>
                      updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="col-span-12 text-right text-sm text-[#64748b]">
                  Total ligne: {(item.quantity * item.unit_price).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Notes (optionnel)
          </label>
          <textarea
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent min-h-[80px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Conditions, remarques..."
          />
        </div>

        {/* Totals */}
        <div className="p-4 bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#64748b]">Sous-total HT:</span>
            <span className="font-medium text-[#0f172a]">
              {subtotal.toFixed(2)} €
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#64748b]">TVA (21%):</span>
            <span className="font-medium text-[#0f172a]">{tax.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-[#cbd5e1] pt-2">
            <span className="text-[#0f172a]">Total TTC:</span>
            <span className="text-[#1e3a8a]">{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Email info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            📧 Le devis sera envoyé à{' '}
            <span className="font-semibold">{client.email}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button
            variant="primary"
            icon={<Send className="w-4 h-4" />}
            onClick={handleSend}
            isLoading={sending}
            className="flex-1"
          >
            Envoyer le devis
          </Button>
        </div>
      </div>
    </Modal>
  );
}
