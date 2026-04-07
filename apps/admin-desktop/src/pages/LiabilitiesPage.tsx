import { GlassPanel, SectionTitle } from '@thihakyaw-leo/ui-components';
import { SearchBar } from '../components/SearchBar';
import { SlideOverForm } from '../components/SlideOverForm';

export function LiabilitiesPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <GlassPanel>
        <SectionTitle
          eyebrow="Liabilities"
          title="Track deductions and balances"
          description="This page is ready for liability creation, remaining-balance updates, and payment history views."
        />
        <SearchBar placeholder="Search liabilities by employee or reason..." />
        <div className="mt-5 rounded-3xl border border-dashed border-white/10 p-6 text-sm text-slate-300">
          Liability ledger and settlement actions will be rendered here.
        </div>
      </GlassPanel>

      <SlideOverForm
        title="Create liability"
        description="Connect this flow to the protected `/api/liabilities/create` endpoint."
      />
    </div>
  );
}
