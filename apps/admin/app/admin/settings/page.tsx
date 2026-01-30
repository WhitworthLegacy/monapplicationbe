"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUserRole } from "@/hooks/useUserRole";

export default function SettingsPage() {
  const { permissions } = useUserRole();
  const [isSaving, setIsSaving] = useState(false);

  if (!permissions.canAccessSettings) {
    return (
      <div className="p-4">
        <Card>
          <CardContent>
            <div className="py-12 text-center">
              <p className="text-gray-500">Accès non autorisé.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres généraux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Nom de l'entreprise"
                defaultValue="Mon Application"
                placeholder="Nom de l'entreprise"
              />
              <Input
                label="Email de contact"
                type="email"
                defaultValue="contact@monapplication.be"
                placeholder="contact@example.com"
              />
              <Input
                label="Téléphone"
                type="tel"
                defaultValue="+32 460 24 24 27"
                placeholder="+32 X XX XX XX XX"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paramètres de notification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="email-notifications"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label
                  htmlFor="email-notifications"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Notifications par email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sms-notifications"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="sms-notifications"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Notifications par SMS
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="push-notifications"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label
                  htmlFor="push-notifications"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Notifications push
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intégrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Clé API Stripe"
                type="password"
                placeholder="sk_live_..."
              />
              <Input
                label="Clé API Twilio"
                type="password"
                placeholder="AC..."
              />
              <Input
                label="URL Webhook FALCO"
                placeholder="https://api.falco.fr/webhook"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} isLoading={isSaving}>
            Enregistrer les paramètres
          </Button>
        </div>
      </div>
    </div>
  );
}
