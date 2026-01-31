"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Download, Send, X, Loader2 } from "lucide-react";
import { QuotePDF, type QuotePDFData } from "./QuotePDF";

interface QuotePreviewModalProps {
  open: boolean;
  onClose: () => void;
  data: QuotePDFData;
  onSendEmail: (pdfBlob: Blob) => Promise<void>;
}

export default function QuotePreviewModal({
  open,
  onClose,
  data,
  onSendEmail,
}: QuotePreviewModalProps) {
  const [isSending, setIsSending] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);

  const totalAmount = useMemo(() => {
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const taxAmount = Math.round((subtotal * data.taxRate) / 100);
    return subtotal + taxAmount;
  }, [data.items, data.taxRate]);

  // Generate PDF blob once when modal opens
  useEffect(() => {
    if (!open) {
      // Cleanup when modal closes
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      setPdfBlob(null);
      setIsLoadingPreview(true);
      return;
    }

    // Generate PDF once on open
    const generatePreview = async () => {
      setIsLoadingPreview(true);
      try {
        const blob = await pdf(<QuotePDF data={data} />).toBlob();
        setPdfBlob(blob);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("[QuotePreview] Failed to generate preview:", error);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    generatePreview();

    // Cleanup function
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDownload = useCallback(() => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devis-${data.clientName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pdfBlob, data.clientName]);

  const handleSendEmail = useCallback(async () => {
    if (!data.clientEmail || !pdfBlob) return;
    setIsSending(true);
    try {
      await onSendEmail(pdfBlob);
    } catch (error) {
      console.error("[QuotePreview] Failed to send email:", error);
    } finally {
      setIsSending(false);
    }
  }, [pdfBlob, data.clientEmail, onSendEmail]);

  if (!open) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`Aperçu du devis - ${data.clientName}`}
      size="5xl"
    >
      <div className="flex flex-col h-[80vh]">
        {/* PDF Preview using iframe */}
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
          {isLoadingPreview ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#b8860b]" />
              <span className="ml-2 text-gray-600">
                Génération de l'aperçu...
              </span>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              className="border-0"
              title="Aperçu du devis"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Erreur lors de la génération du PDF
            </div>
          )}
        </div>

        {/* Summary Bar */}
        <div className="mt-4 p-4 bg-gradient-to-r from-[#fff9ed] to-[#e8f4f8] rounded-xl border-2 border-[#b8860b]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#1e3a8a]">Total du devis</p>
              <p className="text-2xl font-bold text-[#b8860b]">
                {(totalAmount / 100).toFixed(2)}€
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>{data.items.length} ligne(s)</p>
              <p>TVA: {data.taxRate}%</p>
              <p>Validité: {data.validDays || 30} jours</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
          >
            Fermer
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleDownload}
              icon={<Download className="w-4 h-4" />}
              disabled={!pdfBlob}
            >
              Télécharger PDF
            </Button>

            <Button
              variant="primary"
              onClick={handleSendEmail}
              loading={isSending}
              disabled={isSending || !data.clientEmail || !pdfBlob}
              icon={<Send className="w-4 h-4" />}
            >
              {isSending
                ? "Envoi..."
                : data.clientEmail
                  ? `Envoyer à ${data.clientEmail}`
                  : "Pas d'email client"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
