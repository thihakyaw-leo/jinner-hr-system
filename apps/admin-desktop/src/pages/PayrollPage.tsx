import { GlassPanel, SectionTitle } from '@thihakyaw-leo/ui-components';
import { SearchBar } from '../components/SearchBar';
import { SlideOverForm } from '../components/SlideOverForm';

export function PayrollPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <GlassPanel>
        <SectionTitle
          eyebrow="Payroll"
          title="Monthly payroll workspace"
          description="Prepared for payroll summaries, deductions, approvals, and salary export flows."
        />
        <SearchBar placeholder="Search by month, year, branch, or employee..." />
        <div className="mt-5 rounded-3xl border border-dashed border-white/10 p-6 text-sm text-slate-300">
          Payroll list and salary detail cards will be added here.
        </div>
      </GlassPanel>

      <SlideOverForm
        title="Run payroll flow"
        description="Use this slide-over for period setup, deductions review, and approval checkpoints."
      />
    </div>
  );
}
