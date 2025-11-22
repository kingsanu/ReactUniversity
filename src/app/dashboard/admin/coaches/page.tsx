import { SingleInviteForm } from "@/components/admin/SingleInviteForm";
import { BulkInviteForm } from "@/components/admin/BulkInviteForm";
import { CoachesTable } from "@/components/admin/CoachesTable";

export default function CoachesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coaches Management</h1>
        <p className="text-muted-foreground">
          Invite new coaches to the platform individually or in bulk.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SingleInviteForm />
        <BulkInviteForm />
      </div>

      <CoachesTable />
    </div>
  );
}
