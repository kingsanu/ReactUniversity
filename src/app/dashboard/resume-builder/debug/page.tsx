import { TemplateDebugger } from "../_components/TemplateDebugger";

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto">
        <TemplateDebugger />
      </div>
    </div>
  );
}
