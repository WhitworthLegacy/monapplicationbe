"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// MonApplication Brand Colors
const COLORS = {
  primary: "#0f172a",
  secondary: "#1e3a8a",
  accent: "#b8860b",
  accentLight: "#d4a72c",
  gray: "#64748b",
  lightGray: "#f1f5f9",
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.primary,
  },
  // Header
  headerBand: {
    height: 12,
    backgroundColor: COLORS.primary,
  },
  headerBandAccent: {
    height: 6,
    backgroundColor: COLORS.accent,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 40,
    paddingTop: 25,
    paddingBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  logoSubtext: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  quoteNumberBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  quoteNumberText: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.white,
  },
  quoteDate: {
    fontSize: 9,
    color: COLORS.gray,
    marginTop: 2,
  },
  // Content
  content: {
    paddingHorizontal: 40,
    paddingTop: 10,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: COLORS.accent,
    marginTop: 5,
  },
  clientInfo: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  clientRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  clientLabel: {
    width: 80,
    fontWeight: "bold",
    color: COLORS.secondary,
    fontSize: 9,
  },
  clientValue: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 10,
  },
  description: {
    fontSize: 10,
    color: COLORS.gray,
    lineHeight: 1.5,
    marginTop: 10,
  },
  // Table
  table: {
    marginTop: 8,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    padding: 10,
  },
  tableHeaderText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.lightGray,
  },
  colDescription: {
    flex: 3,
  },
  colQty: {
    width: 50,
    textAlign: "center",
  },
  colPrice: {
    width: 80,
    textAlign: "right",
  },
  colTotal: {
    width: 90,
    textAlign: "right",
    fontWeight: "bold",
  },
  // Total section
  totalSection: {
    marginTop: 15,
    alignItems: "flex-end",
  },
  totalBox: {
    backgroundColor: "#fff9ed",
    padding: 15,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.accent,
    width: 220,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    color: COLORS.primary,
    fontSize: 10,
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 10,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: COLORS.accent,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.accent,
  },
  // Valid until
  validUntil: {
    marginTop: 20,
    padding: 14,
    backgroundColor: COLORS.lightGray,
    borderRadius: 6,
    textAlign: "center",
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  validUntilText: {
    fontSize: 10,
    color: COLORS.secondary,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerBand: {
    height: 6,
    backgroundColor: COLORS.accent,
  },
  footerBandPrimary: {
    height: 12,
    backgroundColor: COLORS.primary,
  },
  footerContent: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: COLORS.lightGray,
  },
  footerText: {
    textAlign: "center",
    fontSize: 8,
    color: COLORS.gray,
  },
  footerContact: {
    textAlign: "center",
    fontSize: 9,
    color: COLORS.secondary,
    marginTop: 3,
    fontWeight: "bold",
  },
  notes: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 9,
    color: COLORS.gray,
    lineHeight: 1.4,
  },
});

export interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number; // in cents
}

export interface QuotePDFData {
  quoteNumber?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  title: string;
  description?: string;
  items: QuoteItem[];
  notes?: string;
  taxRate: number;
  validDays?: number;
}

/**
 * Strip markdown formatting from text for clean PDF rendering
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/###\s+/g, '') // Remove ### headers
    .replace(/##\s+/g, '') // Remove ## headers
    .replace(/#\s+/g, '') // Remove # headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove **bold**
    .replace(/\*(.+?)\*/g, '$1') // Remove *italic*
    .replace(/_(.+?)_/g, '$1') // Remove _italic_
    .replace(/`(.+?)`/g, '$1'); // Remove `code`
}

export function QuotePDF({ data }: { data: QuotePDFData }) {
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + (data.validDays || 30));

  const subtotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const taxAmount = Math.round((subtotal * data.taxRate) / 100);
  const total = subtotal + taxAmount;

  // Strip markdown from description for clean PDF rendering
  const cleanDescription = data.description ? stripMarkdown(data.description) : undefined;

  return (
    <Document>
      {/* PAGE 1 - Devis principal */}
      <Page size="A4" style={styles.page}>
        {/* Header Bands */}
        <View style={styles.headerBand} />
        <View style={styles.headerBandAccent} />

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.logoText}>MonApplication</Text>
            <Text style={styles.logoSubtext}>
              Votre secrétaire digitale
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.quoteNumberBadge}>
              <Text style={styles.quoteNumberText}>
                DEVIS {data.quoteNumber || "N° ..."}
              </Text>
            </View>
            <Text style={styles.quoteDate}>
              Date: {today.toLocaleDateString("fr-FR")}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Client Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>INFORMATIONS CLIENT</Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={[styles.clientInfo, { marginTop: 10 }]}>
              <View style={styles.clientRow}>
                <Text style={styles.clientLabel}>Nom:</Text>
                <Text style={styles.clientValue}>{data.clientName}</Text>
              </View>
              {data.clientCompany && (
                <View style={styles.clientRow}>
                  <Text style={styles.clientLabel}>Société:</Text>
                  <Text style={styles.clientValue}>{data.clientCompany}</Text>
                </View>
              )}
              {data.clientPhone && (
                <View style={styles.clientRow}>
                  <Text style={styles.clientLabel}>Téléphone:</Text>
                  <Text style={styles.clientValue}>{data.clientPhone}</Text>
                </View>
              )}
              {data.clientEmail && (
                <View style={styles.clientRow}>
                  <Text style={styles.clientLabel}>Email:</Text>
                  <Text style={styles.clientValue}>{data.clientEmail}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Quote Title */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{data.title}</Text>
            </View>
            <View style={styles.sectionDivider} />
            {cleanDescription && (
              <Text style={[styles.description, { fontSize: 9, marginTop: 8 }]}>
                ℹ️ Voir détails en annexe (page 2)
              </Text>
            )}
          </View>

          {/* Items Table */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>DÉTAIL DU DEVIS</Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={[styles.table, { marginTop: 10 }]}>
              <View style={styles.tableHeader}>
                <Text style={[styles.colDescription, styles.tableHeaderText]}>
                  Description
                </Text>
                <Text style={[styles.colQty, styles.tableHeaderText]}>
                  Qté
                </Text>
                <Text style={[styles.colPrice, styles.tableHeaderText]}>
                  P.U.
                </Text>
                <Text style={[styles.colTotal, styles.tableHeaderText]}>
                  Total
                </Text>
              </View>
              {data.items.map((item, index) => (
                <View
                  key={index}
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                >
                  <Text style={styles.colDescription}>{item.description}</Text>
                  <Text style={styles.colQty}>{item.quantity}</Text>
                  <Text style={styles.colPrice}>
                    {(item.unit_price / 100).toFixed(2)}€
                  </Text>
                  <Text style={styles.colTotal}>
                    {((item.quantity * item.unit_price) / 100).toFixed(2)}€
                  </Text>
                </View>
              ))}
            </View>

            {/* Total */}
            <View style={styles.totalSection}>
              <View style={styles.totalBox}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total HTVA:</Text>
                  <Text style={styles.totalValue}>
                    {(subtotal / 100).toFixed(2)}€
                  </Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>
                    TVA ({data.taxRate}%):
                  </Text>
                  <Text style={styles.totalValue}>
                    {(taxAmount / 100).toFixed(2)}€
                  </Text>
                </View>
                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>TOTAL TVAC</Text>
                  <Text style={styles.grandTotalValue}>
                    {(total / 100).toFixed(2)}€
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notes */}
          {data.notes && (
            <View style={styles.notes}>
              <Text style={styles.notesTitle}>Notes:</Text>
              <Text style={styles.notesText}>{data.notes}</Text>
            </View>
          )}

          {/* Valid Until */}
          <View style={styles.validUntil}>
            <Text style={styles.validUntilText}>
              Ce devis est valable jusqu'au{" "}
              {validUntil.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerBand} />
          <View style={styles.footerContent}>
            <Text style={styles.footerText}>
              MonApplication - Votre secrétaire digitale complète
            </Text>
            <Text style={styles.footerContact}>
              contact@monapplication.be | Belgique
            </Text>
          </View>
          <View style={styles.footerBandPrimary} />
        </View>
      </Page>

      {/* PAGE 2 - Annexe Description détaillée */}
      {cleanDescription && (
        <Page size="A4" style={styles.page}>
          {/* Header Bands */}
          <View style={styles.headerBand} />
          <View style={styles.headerBandAccent} />

          {/* Header Content */}
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.logoText}>MonApplication</Text>
              <Text style={styles.logoSubtext}>
                Votre secrétaire digitale
              </Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.quoteNumberBadge}>
                <Text style={styles.quoteNumberText}>
                  ANNEXE - Page 2/2
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  DESCRIPTION DÉTAILLÉE - {data.title}
                </Text>
              </View>
              <View style={styles.sectionDivider} />
              <Text style={[styles.description, { marginTop: 15 }]}>
                {cleanDescription}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer} fixed>
            <View style={styles.footerBand} />
            <View style={styles.footerContent}>
              <Text style={styles.footerText}>
                MonApplication - Votre secrétaire digitale complète
              </Text>
              <Text style={styles.footerContact}>
                contact@monapplication.be | Belgique
              </Text>
            </View>
            <View style={styles.footerBandPrimary} />
          </View>
        </Page>
      )}
    </Document>
  );
}
