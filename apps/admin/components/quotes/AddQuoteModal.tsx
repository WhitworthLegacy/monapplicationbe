"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createBrowserClient } from "@/lib/supabase/client";

interface Client {
  id: string;
  full_name: string;
  company?: string;
  email?: string;
}

interface AddQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (quoteId: string) => void;
}

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export default function AddQuoteModal({
  isOpen,
  onClose,
  onSuccess,
}: AddQuoteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const toast = useToast();

  const [formData, setFormData] = useState({
    client_id: "",
    title: "",
    description: "",
    tax_rate: 21,
    notes: "",
  });

  const [items, setItems] = useState<QuoteItem[]>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("clients")
        .select("id, full_name, company, email")
        .order("full_name", { ascending: true });

      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * formData.tax_rate) / 100;
    return subtotal + taxAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client_id || !formData.title) {
      toast.addToast("Le client et le titre sont requis", "error");
      return;
    }

    if (items.some((item) => !item.description)) {
      toast.addToast("Toutes les lignes doivent avoir une description", "error");
      return;
    }

    setIsLoading(true);

    try {
      const subtotal = calculateSubtotal();
      const taxAmount = (subtotal * formData.tax_rate) / 100;
      const total = subtotal + taxAmount;

      const supabase = createBrowserClient();

      // Create quote
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .insert([
          {
            client_id: formData.client_id,
            title: formData.title,
            description: formData.description || null,
            subtotal: Math.round(subtotal * 100), // Convert to cents
            tax_rate: formData.tax_rate,
            tax_amount: Math.round(taxAmount * 100),
            total: Math.round(total * 100),
            status: "draft",
            notes: formData.notes || null,
          },
        ])
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Create quote items
      const itemsToInsert = items.map((item, index) => ({
        quote_id: quoteData.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: Math.round(item.unit_price * 100), // Convert to cents
        line_total: Math.round(item.quantity * item.unit_price * 100),
        position: index,
      }));

      const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast.addToast("Devis créé avec succès !", "success");

      // Reset form
      setFormData({
        client_id: "",
        title: "",
        description: "",
        tax_rate: 21,
        notes: "",
      });
      setItems([{ description: "", quantity: 1, unit_price: 0 }]);

      if (onSuccess) {
        onSuccess(quoteData.id);
      }

      onClose();
    } catch (error) {
      console.error("Error creating quote:", error);
      toast.addToast("Erreur lors de la création du devis", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un nouveau devis"
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Client *"
            value={formData.client_id}
            onChange={(e) =>
              setFormData({ ...formData, client_id: e.target.value })
            }
            required
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name}
                {client.company ? ` - ${client.company}` : ""}
              </option>
            ))}
          </Select>

          <Input
            label="Titre *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Ex: Installation système complet"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#0f172a] mb-2">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b] focus:border-transparent"
            rows={2}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description générale du devis..."
          />
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-[#0f172a]">
              Lignes du devis
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={addItem}>
              + Ajouter une ligne
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 p-3 border border-[#e2e8f0] rounded-lg"
              >
                <div className="col-span-5">
                  <Input
                    placeholder="Description *"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
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
                      updateItem(index, "quantity", Number(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Prix unitaire"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) =>
                      updateItem(index, "unit_price", Number(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {(item.quantity * item.unit_price).toFixed(2)} €
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax & Totals */}
        <div className="border-t border-[#e2e8f0] pt-4">
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">Sous-total:</span>
                <span className="font-semibold">
                  {calculateSubtotal().toFixed(2)} €
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
                    value={formData.tax_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tax_rate: Number(e.target.value),
                      })
                    }
                    className="w-20 text-right"
                  />
                  <span>%</span>
                  <span className="font-semibold w-24 text-right">
                    {((calculateSubtotal() * formData.tax_rate) / 100).toFixed(
                      2
                    )}{" "}
                    €
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-[#e2e8f0] pt-2">
                <span>Total:</span>
                <span className="text-[#b8860b]">
                  {calculateTotal().toFixed(2)} €
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
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Notes visibles uniquement par vous..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Créer le devis
          </Button>
        </div>
      </form>
    </Modal>
  );
}
