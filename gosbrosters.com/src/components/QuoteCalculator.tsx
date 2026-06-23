"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "./LanguageContext";
import MaskReveal from "./MaskReveal";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ProjectType = {
  id: string;
  label_es: string;
  label_en: string;
  baseRate: number;
};

type SizeRange = {
  id: string;
  label: string;
  min: number;
  max: number;
};

type BrandingScope = {
  id: string;
  label_es: string;
  label_en: string;
  basePrice: number;
};

type ClientSize = {
  id: string;
  label_es: string;
  label_en: string;
  multiplier: number;
};

type StrategyType = {
  id: string;
  label_es: string;
  label_en: string;
  basePrice: number;
};

type PricingData = {
  exchangeRate: number;
  variancePercent: number;
  architecture: {
    projectTypes: ProjectType[];
    sizeRanges: SizeRange[];
  };
  branding: {
    scopes: BrandingScope[];
    clientSizes: ClientSize[];
  };
  strategy: {
    types: StrategyType[];
  };
};

type ServiceCategory = "architecture" | "branding" | "strategy";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function QuoteCalculator() {
  const { language, t } = useLanguage();

  // Data
  const [pricing, setPricing] = useState<PricingData | null>(null);

  // Wizard state
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  // Selections
  const [service, setService] = useState<ServiceCategory | null>(null);
  const [archType, setArchType] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [customArea, setCustomArea] = useState("");
  const [useCustomArea, setUseCustomArea] = useState(false);
  const [brandScope, setBrandScope] = useState<string | null>(null);
  const [clientSize, setClientSize] = useState<string | null>(null);
  const [stratType, setStratType] = useState<string | null>(null);

  // Result
  const [currency, setCurrency] = useState<"MXN" | "USD">("MXN");

  // Load pricing on mount
  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then(setPricing)
      .catch(console.error);
  }, []);

  /* ---- Navigation helpers ---- */

  const goTo = useCallback(
    (nextStep: number) => {
      setAnimating(true);
      setTimeout(() => {
        setStep(nextStep);
        setAnimating(false);
      }, 300);
    },
    []
  );

  const handleServiceSelect = (svc: ServiceCategory) => {
    setService(svc);
    goTo(2);
  };

  const canProceedStep2 = (): boolean => {
    if (service === "architecture") {
      const hasArea = useCustomArea
        ? Number(customArea) > 0
        : selectedRange !== null;
      return archType !== null && hasArea;
    }
    if (service === "branding") return brandScope !== null && clientSize !== null;
    if (service === "strategy") return stratType !== null;
    return false;
  };

  const handleReset = () => {
    setService(null);
    setArchType(null);
    setSelectedRange(null);
    setCustomArea("");
    setUseCustomArea(false);
    setBrandScope(null);
    setClientSize(null);
    setStratType(null);
    goTo(1);
  };

  /* ---- Calculation ---- */

  const calculateQuote = (): { min: number; max: number } | null => {
    if (!pricing) return null;
    let base = 0;

    if (service === "architecture" && archType) {
      const type = pricing.architecture.projectTypes.find(
        (p) => p.id === archType
      );
      if (!type) return null;

      let area: number;
      if (useCustomArea) {
        area = Number(customArea);
        if (area <= 0) return null;
      } else {
        const range = pricing.architecture.sizeRanges.find(
          (r) => r.id === selectedRange
        );
        if (!range) return null;
        area = (range.min + range.max) / 2;
      }
      base = type.baseRate * area;
    } else if (service === "branding" && brandScope && clientSize) {
      const scope = pricing.branding.scopes.find((s) => s.id === brandScope);
      const size = pricing.branding.clientSizes.find(
        (s) => s.id === clientSize
      );
      if (!scope || !size) return null;
      base = scope.basePrice * size.multiplier;
    } else if (service === "strategy" && stratType) {
      const type = pricing.strategy.types.find((s) => s.id === stratType);
      if (!type) return null;
      base = type.basePrice;
    } else {
      return null;
    }

    const v = pricing.variancePercent / 100;
    let min = Math.round(base * (1 - v));
    let max = Math.round(base * (1 + v));

    if (currency === "USD") {
      min = Math.round(min / pricing.exchangeRate);
      max = Math.round(max / pricing.exchangeRate);
    }

    return { min, max };
  };

  /* ---- Formatting ---- */

  const fmt = (n: number): string => {
    return n.toLocaleString(language === "es" ? "es-MX" : "en-US");
  };

  const currencySymbol = currency === "MXN" ? "$" : "US$";

  /* ---- WhatsApp & email helpers ---- */

  const buildWhatsAppUrl = (): string => {
    const quote = calculateQuote();
    if (!quote) return "#";
    const serviceLabel = service ? t(`quote.${service}`) : "";
    const msg =
      language === "es"
        ? `Hola GOSBROS, me interesa cotizar un proyecto de ${serviceLabel}. El estimado del calculador fue ${currencySymbol}${fmt(quote.min)} – ${currencySymbol}${fmt(quote.max)} ${currency}. ¿Podemos agendar una consulta?`
        : `Hi GOSBROS, I'm interested in a ${serviceLabel} project. The calculator estimate was ${currencySymbol}${fmt(quote.min)} – ${currencySymbol}${fmt(quote.max)} ${currency}. Can we schedule a consultation?`;
    return `https://wa.me/5256231812754?text=${encodeURIComponent(msg)}`;
  };

  const buildEmailUrl = (): string => {
    const quote = calculateQuote();
    if (!quote) return "#";
    const serviceLabel = service ? t(`quote.${service}`) : "";
    const subject =
      language === "es"
        ? `Cotización – ${serviceLabel}`
        : `Quote Request – ${serviceLabel}`;
    const body =
      language === "es"
        ? `Hola GOSBROS,\n\nMe interesa cotizar un proyecto de ${serviceLabel}.\nEstimado del calculador: ${currencySymbol}${fmt(quote.min)} – ${currencySymbol}${fmt(quote.max)} ${currency}.\n\nQuedo atento a sus comentarios.`
        : `Hi GOSBROS,\n\nI'm interested in a ${serviceLabel} project.\nCalculator estimate: ${currencySymbol}${fmt(quote.min)} – ${currencySymbol}${fmt(quote.max)} ${currency}.\n\nLooking forward to hearing from you.`;
    return `mailto:contacto@gosbros.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  /* ---- Label helper for localized pricing data ---- */

  const label = (item: { label_es: string; label_en: string }): string =>
    language === "es" ? item.label_es : item.label_en;

  /* ================================================================== */
  /*  RENDER                                                             */
  /* ================================================================== */

  if (!pricing) {
    return (
      <section className="py-[var(--spacing-8)] px-4 md:px-8 bg-white grid-line border-black">
        <div className="max-w-[1800px] mx-auto flex items-center justify-center min-h-[300px]">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-gray-400 animate-pulse">
            Loading...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section
      id="quote-calculator"
      className="py-[var(--spacing-8)] md:py-[var(--spacing-9)] px-4 md:px-8 bg-white grid-line border-black"
    >
      <div className="max-w-[1800px] mx-auto">
        {/* ---- Header ---- */}
        <div className="flex flex-col mb-[var(--spacing-7)] md:mb-[var(--spacing-8)]">
          <div className="w-full">
            <MaskReveal>
              <h2 className="text-h2 leading-[0.85] font-display font-black tracking-tighter uppercase text-left w-full whitespace-pre-line">
                {t("quote.heading")}
              </h2>
            </MaskReveal>
            <div className="text-xs font-sans uppercase font-bold tracking-widest mt-[var(--spacing-4)] mb-[var(--spacing-2)] leading-tight whitespace-pre-line text-gray-400">
              {t("quote.step")} {step < 4 ? `0${step}` : "03"} / 03
            </div>
            <p className="font-serif italic text-gray-500 text-sm">
              {t("quote.subheading")}
            </p>
          </div>
        </div>

        {/* ---- Step Progress Bar ---- */}
        <div className="flex items-center gap-0 mb-[var(--spacing-7)] w-full max-w-[400px]">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 flex items-center justify-center font-serif text-sm transition-all duration-300 ${
                  s <= step
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-300"
                }`}
              >
                {`0${s}`}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-px transition-all duration-500 ${
                    s < step ? "bg-black" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ---- Step Content ---- */}
        <div
          className={`transition-all duration-300 ${
            animating
              ? "opacity-0 translate-y-4"
              : "opacity-100 translate-y-0"
          }`}
        >
          {/* ============ STEP 1: Service Selection ============ */}
          {step === 1 && (
            <div>
              <h3 className="text-xs font-sans uppercase font-bold tracking-widest mb-[var(--spacing-5)]">
                {t("quote.selectService")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-3)]">
                {(
                  [
                    {
                      id: "architecture" as ServiceCategory,
                      num: "01",
                      labelKey: "quote.architecture",
                      descKey: "quote.architectureDesc",
                    },
                    {
                      id: "branding" as ServiceCategory,
                      num: "02",
                      labelKey: "quote.branding",
                      descKey: "quote.brandingDesc",
                    },
                    {
                      id: "strategy" as ServiceCategory,
                      num: "03",
                      labelKey: "quote.strategy",
                      descKey: "quote.strategyDesc",
                    },
                  ] as const
                ).map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => handleServiceSelect(svc.id)}
                    className="group border border-black p-[var(--spacing-5)] md:p-[var(--spacing-6)] text-left transition-all duration-300 hover:bg-black hover:text-white flex flex-col justify-between min-h-[160px] md:min-h-[220px]"
                    data-cursor-hover
                  >
                    <span className="font-serif text-sm text-gray-400 group-hover:text-gray-400 transition-colors">
                      {svc.num}
                    </span>
                    <div>
                      <span className="block text-h3 font-display font-black tracking-tighter uppercase leading-[0.85]">
                        {t(svc.labelKey)}
                      </span>
                      <span className="block mt-2 font-sans text-xs md:text-sm text-gray-500 group-hover:text-gray-300 transition-colors leading-snug">
                        {t(svc.descKey)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============ STEP 2: Details ============ */}
          {step === 2 && service && (
            <div className="flex flex-col gap-[var(--spacing-7)]">
              {/* ---- Architecture Details ---- */}
              {service === "architecture" && (
                <>
                  {/* Project Type */}
                  <div>
                    <h3 className="text-xs font-sans uppercase font-bold tracking-widest mb-[var(--spacing-4)]">
                      {t("quote.selectProjectType")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-3)]">
                      {pricing.architecture.projectTypes.map((pt) => (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => setArchType(pt.id)}
                          className={`border p-[var(--spacing-4)] md:p-[var(--spacing-5)] text-left transition-all duration-300 font-display font-black uppercase tracking-tighter text-h3 leading-[0.85] ${
                            archType === pt.id
                              ? "bg-black text-white border-black"
                              : "border-black hover:bg-black hover:text-white"
                          }`}
                          data-cursor-hover
                        >
                          {label(pt)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Area */}
                  <div>
                    <h3 className="text-xs font-sans uppercase font-bold tracking-widest mb-[var(--spacing-4)]">
                      {t("quote.selectArea")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--spacing-3)] mb-[var(--spacing-4)]">
                      {pricing.architecture.sizeRanges.map((sr) => (
                        <button
                          key={sr.id}
                          type="button"
                          onClick={() => {
                            setSelectedRange(sr.id);
                            setUseCustomArea(false);
                            setCustomArea("");
                          }}
                          className={`border p-[var(--spacing-3)] md:p-[var(--spacing-4)] text-center transition-all duration-300 font-sans font-bold text-sm uppercase ${
                            !useCustomArea && selectedRange === sr.id
                              ? "bg-black text-white border-black"
                              : "border-black hover:bg-black hover:text-white"
                          }`}
                          data-cursor-hover
                        >
                          {sr.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom area input */}
                    <div className="flex items-center gap-[var(--spacing-3)]">
                      <span className="text-xs font-sans uppercase font-bold tracking-widest text-gray-400 shrink-0">
                        {t("quote.customArea")}
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={customArea}
                        onChange={(e) => {
                          setCustomArea(e.target.value);
                          if (e.target.value) {
                            setUseCustomArea(true);
                            setSelectedRange(null);
                          } else {
                            setUseCustomArea(false);
                          }
                        }}
                        placeholder={t("quote.enterArea")}
                        className="border border-black p-3 outline-none focus:bg-black focus:text-white transition-colors font-sans text-sm w-full max-w-[200px]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ---- Branding Details ---- */}
              {service === "branding" && (
                <>
                  {/* Scope */}
                  <div>
                    <h3 className="text-xs font-sans uppercase font-bold tracking-widest mb-[var(--spacing-4)]">
                      {t("quote.selectScope")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-3)]">
                      {pricing.branding.scopes.map((sc) => (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => setBrandScope(sc.id)}
                          className={`border p-[var(--spacing-4)] md:p-[var(--spacing-5)] text-left transition-all duration-300 font-display font-black uppercase tracking-tighter text-h3 leading-[0.85] ${
                            brandScope === sc.id
                              ? "bg-black text-white border-black"
                              : "border-black hover:bg-black hover:text-white"
                          }`}
                          data-cursor-hover
                        >
                          {label(sc)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Client Size */}
                  <div>
                    <h3 className="text-xs font-sans uppercase font-bold tracking-widest mb-[var(--spacing-4)]">
                      {t("quote.selectClientSize")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-3)]">
                      {pricing.branding.clientSizes.map((cs) => (
                        <button
                          key={cs.id}
                          type="button"
                          onClick={() => setClientSize(cs.id)}
                          className={`border p-[var(--spacing-3)] md:p-[var(--spacing-4)] text-left transition-all duration-300 font-sans font-bold text-sm uppercase tracking-wider ${
                            clientSize === cs.id
                              ? "bg-black text-white border-black"
                              : "border-black hover:bg-black hover:text-white"
                          }`}
                          data-cursor-hover
                        >
                          {label(cs)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ---- Strategy Details ---- */}
              {service === "strategy" && (
                <div>
                  <h3 className="text-xs font-sans uppercase font-bold tracking-widest mb-[var(--spacing-4)]">
                    {t("quote.selectStrategyType")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-3)]">
                    {pricing.strategy.types.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStratType(st.id)}
                        className={`border p-[var(--spacing-4)] md:p-[var(--spacing-5)] text-left transition-all duration-300 font-display font-black uppercase tracking-tighter text-h3 leading-[0.85] ${
                          stratType === st.id
                            ? "bg-black text-white border-black"
                            : "border-black hover:bg-black hover:text-white"
                        }`}
                        data-cursor-hover
                      >
                        {label(st)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ---- Step 2 Navigation ---- */}
              <div className="flex justify-between items-center pt-[var(--spacing-4)] border-t border-black">
                <button
                  type="button"
                  onClick={() => {
                    setService(null);
                    goTo(1);
                  }}
                  className="text-xs font-sans font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-60 transition-opacity"
                  data-cursor-hover
                >
                  <span className="text-lg leading-none">&larr;</span>{" "}
                  {t("quote.back")}
                </button>

                <button
                  type="button"
                  disabled={!canProceedStep2()}
                  onClick={() => goTo(3)}
                  className={`px-6 py-3 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 border border-black ${
                    canProceedStep2()
                      ? "bg-black text-white hover:bg-white hover:text-black"
                      : "bg-gray-200 text-gray-400 border-gray-300 pointer-events-none"
                  }`}
                  data-cursor-hover
                >
                  {t("quote.next")} <span className="ml-2">&rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* ============ STEP 3: Result ============ */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center">
              {/* Currency Toggle */}
              <div className="flex items-center gap-[var(--spacing-3)] mb-[var(--spacing-6)] self-end">
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-gray-400">
                  {t("quote.currency")}
                </span>
                <div className="flex border border-black">
                  <button
                    type="button"
                    onClick={() => setCurrency("MXN")}
                    className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 ${
                      currency === "MXN"
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                    data-cursor-hover
                  >
                    MXN
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrency("USD")}
                    className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 border-l border-black ${
                      currency === "USD"
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                    data-cursor-hover
                  >
                    USD
                  </button>
                </div>
              </div>

              {/* Service Label */}
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-gray-400 mb-[var(--spacing-3)]">
                {service ? t(`quote.${service}`) : ""}
              </span>

              {/* Estimate Label */}
              <MaskReveal>
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-gray-400 mb-[var(--spacing-2)] block">
                  {t("quote.yourEstimate")}
                </span>
              </MaskReveal>

              {/* Price */}
              {(() => {
                const quote = calculateQuote();
                if (!quote) return null;
                return (
                  <MaskReveal>
                    <div className="text-h2 md:text-hero font-display font-black tracking-tighter leading-[0.85] uppercase my-[var(--spacing-4)]">
                      {currencySymbol}
                      {fmt(quote.min)}
                      <span className="mx-2 md:mx-4 text-gray-300">&ndash;</span>
                      {currencySymbol}
                      {fmt(quote.max)}
                    </div>
                  </MaskReveal>
                );
              })()}

              {/* Currency tag */}
              <span className="font-serif italic text-gray-500 text-sm mb-[var(--spacing-6)]">
                {currency}
              </span>

              {/* Disclaimer */}
              <p className="font-sans text-body text-gray-500 max-w-xl mb-[var(--spacing-7)] leading-[1.3]">
                {t("quote.estimateDisclaimer")}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-[var(--spacing-3)] w-full max-w-xl">
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-black text-white px-6 py-4 text-xs font-sans font-bold uppercase tracking-widest text-center transition-all duration-300 hover:bg-[#25D366] hover:text-white border border-black hover:border-[#25D366]"
                  data-cursor-hover
                >
                  {t("quote.whatsappCta")}
                </a>
                <a
                  href={buildEmailUrl()}
                  className="flex-1 bg-white text-black px-6 py-4 text-xs font-sans font-bold uppercase tracking-widest text-center transition-all duration-300 hover:bg-black hover:text-white border border-black"
                  data-cursor-hover
                >
                  {t("quote.emailCta")}
                </a>
              </div>

              {/* Start Over */}
              <button
                type="button"
                onClick={handleReset}
                className="mt-[var(--spacing-6)] text-xs font-sans font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-2"
                data-cursor-hover
              >
                <span className="text-lg leading-none">&larr;</span>{" "}
                {t("quote.startOver")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
