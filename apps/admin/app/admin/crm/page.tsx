import CrmBoard from "@/components/crm/CrmBoard";

export const metadata = {
  title: "CRM Pipeline | monapplication.be Admin",
  description: "Gérez votre pipeline commercial avec notre CRM Kanban",
};

export default function CrmPage() {
  return (
    <div className="space-y-6">
      <CrmBoard />
    </div>
  );
}
