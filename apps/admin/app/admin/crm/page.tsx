"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createBrowserClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type CRMStage =
  | "prospect"
  | "contact"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed_won"
  | "closed_lost";

interface Client {
  id: string;
  tracking_id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  crm_stage: CRMStage;
  created_at: string;
}

const stages: { id: CRMStage; label: string; color: string }[] = [
  { id: "prospect", label: "Prospect", color: "bg-gray-100" },
  { id: "contact", label: "Contact", color: "bg-blue-100" },
  { id: "qualified", label: "Qualifié", color: "bg-cyan-100" },
  { id: "proposal", label: "Proposition", color: "bg-purple-100" },
  { id: "negotiation", label: "Négociation", color: "bg-yellow-100" },
  { id: "closed_won", label: "Gagné", color: "bg-green-100" },
  { id: "closed_lost", label: "Perdu", color: "bg-red-100" },
];

export default function CRMPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    const fetchClients = async () => {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setClients(data);
      }
      setIsLoading(false);
    };

    fetchClients();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const clientId = active.id as string;
    const newStage = over.id as CRMStage;

    const client = clients.find((c) => c.id === clientId);
    if (!client || client.crm_stage === newStage) {
      setActiveId(null);
      return;
    }

    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, crm_stage: newStage } : c)),
    );

    const supabase = createBrowserClient();
    await supabase
      .from("clients")
      .update({ crm_stage: newStage })
      .eq("id", clientId);

    setActiveId(null);
  };

  const activeClient = clients.find((c) => c.id === activeId);

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">CRM Board</h1>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-7 gap-4">
          {stages.map((stage) => {
            const stageClients = clients.filter(
              (c) => c.crm_stage === stage.id,
            );

            return (
              <div key={stage.id} className="flex flex-col">
                <Card className="mb-4">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-semibold flex items-center justify-between">
                      <span>{stage.label}</span>
                      <Badge variant="default">{stageClients.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>

                <div
                  className={`flex-1 p-4 rounded-lg ${stage.color} min-h-[500px]`}
                  data-stage={stage.id}
                >
                  <div className="space-y-3">
                    {stageClients.map((client) => (
                      <Card
                        key={client.id}
                        className="cursor-move hover:shadow-lg transition-shadow"
                        draggable
                      >
                        <CardContent className="p-4">
                          <p className="font-medium text-sm">
                            {client.full_name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {client.email}
                          </p>
                          {client.company && (
                            <p className="text-xs text-gray-600 mt-1">
                              {client.company}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {client.tracking_id}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeClient && (
            <Card className="cursor-move shadow-2xl">
              <CardContent className="p-4">
                <p className="font-medium text-sm">{activeClient.full_name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activeClient.email}
                </p>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
