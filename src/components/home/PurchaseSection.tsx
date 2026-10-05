import type { Dictionary } from '@/i18n/dictionaries/ru';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { LeadButton } from '@/components/forms/LeadButton';

/**
 * Ways to buy.
 *
 * Four routes, each with the number that matters (down payment, rate, term) on
 * the card — followed by the five steps of the deal. The steps exist because
 * "what happens after I leave a request" is one of the biggest unanswered
 * questions on developer sites, and it is a cheap objection to remove.
 */
export function PurchaseSection({ dict }: { dict: Dictionary }) {
  return (
    <section className="section bg-paper" id="purchase">
      <div className="shell">
        <SectionHeading
          eyebrow={dict.purchase.eyebrow}
          title={dict.purchase.title}
          lead={dict.purchase.lead}
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dict.purchase.methods.map((method, index) => (
            <li key={method.title} className="card flex flex-col p-6">
              <Reveal delay={index * 60} className="flex h-full flex-col">
                <span className="num font-display text-sm text-clay">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-2xl leading-tight text-ink">
                  {method.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{method.text}</p>
                <p className="mt-4 rounded-xs bg-bone px-3 py-2 text-[0.6875rem] text-ink-soft">
                  {method.meta}
                </p>
                <div className="mt-auto pt-5">
                  <LeadButton
                    source={`purchase:${method.title}`}
                    subject={method.title}
                    variant="outline"
                    fullWidth
                  >
                    {method.cta}
                  </LeadButton>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <h3 className="font-display text-3xl text-ink">{dict.purchase.stepsTitle}</h3>
            <ol className="mt-6 space-y-5">
              {dict.purchase.steps.map((step) => (
                <li key={step.title} className="flex gap-5 border-t border-line pt-5">
                  <span className="num flex-none font-display text-2xl text-clay">
                    {step.title.split('.')[0]}
                  </span>
                  <div>
                    <h4 className="text-[0.9375rem] font-medium text-ink">
                      {step.title.split('. ').slice(1).join('. ')}
                    </h4>
                    <p className="mt-1.5 max-w-[58ch] text-sm leading-relaxed text-ink-soft">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="rounded-sm border border-line bg-bone p-6">
            <h3 className="font-display text-xl text-ink">{dict.purchase.eyebrow}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{dict.purchase.disclaimer}</p>
            <LeadButton
              source="purchase-sidebar"
              variant="primary"
              className="mt-6 w-full"
            >
              {dict.cta.getConsultation}
            </LeadButton>
            <p className="mt-4 text-xs text-muted">
              {dict.form.guaranteed}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
