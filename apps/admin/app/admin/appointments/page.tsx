import AppointmentsAgenda from "@/components/appointments/AppointmentsAgenda";

export const metadata = {
  title: "Rendez-vous | monapplication.be Admin",
  description: "Gérez vos rendez-vous avec liens visio automatiques",
};

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <AppointmentsAgenda />
    </div>
  );
}
