"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import AddClientModal from "@/components/clients/AddClientModal";

interface Client {
  id: string;
  tracking_id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  crm_stage: string;
  created_at: string;
}

const crmStageOptions = [
  { value: "all", label: "Tous les stages" },
  { value: "prospect", label: "Prospect" },
  { value: "contact", label: "Contact" },
  { value: "qualified", label: "Qualifié" },
  { value: "proposal", label: "Proposition" },
  { value: "negotiation", label: "Négociation" },
  { value: "closed_won", label: "Gagné" },
  { value: "closed_lost", label: "Perdu" },
];

const stageColors: Record<
  string,
  "success" | "warning" | "danger" | "info" | "default"
> = {
  prospect: "default",
  contact: "info",
  qualified: "info",
  proposal: "warning",
  negotiation: "warning",
  closed_won: "success",
  closed_lost: "danger",
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchClients = async () => {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setClients(data);
      setFilteredClients(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.company?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (stageFilter !== "all") {
      filtered = filtered.filter((client) => client.crm_stage === stageFilter);
    }

    setFilteredClients(filtered);
  }, [searchTerm, stageFilter, clients]);

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <Button onClick={() => setShowAddModal(true)}>Ajouter un client</Button>
      </div>

      <Card className="mb-6">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Input
              placeholder="Rechercher par nom, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={crmStageOptions}
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredClients.length} client
            {filteredClients.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom complet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage CRM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.tracking_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {client.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.company || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={stageColors[client.crm_stage] || "default"}
                      >
                        {client.crm_stage}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(client.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchClients(); // Refresh the list
        }}
      />
    </div>
  );
}
