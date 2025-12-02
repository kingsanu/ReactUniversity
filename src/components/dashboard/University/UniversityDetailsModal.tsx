"use client";

import React from "react";
import { motion } from "motion/react";
import { UniversityDetailsModalProps } from "@/types/university";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe2, ExternalLink, GraduationCap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";

export function UniversityDetailsModal({
  university,
  isOpen,
  onClose,
  matchScore,
  matchBreakdown,
  matchReasons,
  recommendedPrograms,
}: UniversityDetailsModalProps) {
  const { language } = useGlobalStore();
  if (!university) return null;

  const t = (en: string, es: string) => (language === "spanish" ? es : en);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-0">
          <div className="relative h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
            {university.coverImage && (
              <div
                className="absolute inset-0 opacity-50 bg-cover bg-center"
                style={{ backgroundImage: `url(${university.coverImage})` }}
              />
            )}
            <div className="relative flex h-full items-end justify-between px-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-white shadow flex items-center justify-center overflow-hidden">
                  {university.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={university.logo} alt={university.name} className="h-full w-full object-contain p-1" />
                  ) : (
                    <span className="text-sm font-semibold">{university.shortName || university.name.slice(0, 3)}</span>
                  )}
                </div>
                <div>
                  <DialogTitle className="text-lg font-semibold text-white">
                    {university.name}
                  </DialogTitle>
                  <p className="text-xs text-slate-200 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {university.city}, {university.country}
                  </p>
                </div>
              </div>
              {typeof matchScore === "number" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-end text-emerald-200"
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{matchScore}</span>
                    <span className="text-xs">/100</span>
                  </div>
                  <p className="text-[11px]">{t("Overall match", "Coincidencia total")}</p>
                </motion.div>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="grid gap-5 px-5 py-4 md:grid-cols-[2fr,1.3fr]">
            {/* Left: Description & programs */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {university.description}
              </p>

              {matchReasons && matchReasons.length > 0 && (
                <div className="rounded-lg border bg-emerald-50/40 dark:bg-emerald-900/10 p-3">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 mb-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {t("Why this university fits you", "Por qué esta universidad encaja contigo")}
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-emerald-900 dark:text-emerald-100">
                    {matchReasons.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendedPrograms && recommendedPrograms.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {t("Recommended programs", "Programas recomendados")}
                  </p>
                  <div className="space-y-2">
                    {recommendedPrograms.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-lg border bg-card/40 px-3 py-2 text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {p.degree} • {p.field}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold">
                            {p.matchScore.toFixed(0)} / 100
                          </p>
                          {p.duration && (
                            <p className="text-[10px] text-muted-foreground">
                              {p.duration} {t("years", "años")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: stats & meta */}
            <div className="space-y-3">
              <div className="rounded-lg border bg-card/40 p-3 text-xs space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground mb-1">
                  {t("At a glance", "De un vistazo")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {university.ranking.global && (
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t("Global rank", "Ranking global")}</p>
                      <p className="text-sm font-semibold">#{university.ranking.global}</p>
                    </div>
                  )}
                  {university.acceptanceRate && (
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t("Acceptance", "Aceptación")}</p>
                      <p className="text-sm font-semibold">{university.acceptanceRate}%</p>
                    </div>
                  )}
                  {university.graduationRate && (
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t("Graduation", "Graduación")}</p>
                      <p className="text-sm font-semibold">{university.graduationRate}%</p>
                    </div>
                  )}
                  {university.employmentRate && (
                    <div>
                      <p className="text-[10px] text-muted-foreground">{t("Employment", "Empleabilidad")}</p>
                      <p className="text-sm font-semibold">{university.employmentRate}%</p>
                    </div>
                  )}
                </div>

                {university.tuition && (
                  <div className="mt-2 border-t pt-2">
                    <p className="text-[10px] text-muted-foreground mb-1">
                      {t("Estimated tuition per year", "Matrícula estimada por año")}
                    </p>
                    <p className="text-sm font-semibold">
                      $
                      {(university.tuition.international ?? university.tuition.outOfState ?? university.tuition.inState ?? 0).toLocaleString()}{" "}
                      {university.tuition.currency}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {language === "spanish" ? "Referencia aproximada" : "Approximate reference"}
                    </p>
                  </div>
                )}
              </div>

              {university.highlights && university.highlights.length > 0 && (
                <div className="rounded-lg border bg-card/40 p-3 text-xs">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1">
                    {t("Highlights", "Puntos destacados")}
                  </p>
                  <ul className="space-y-1.5">
                    {university.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border bg-card/40 p-3 text-xs space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Globe2 className="h-3 w-3" />
                  {t("Official links", "Enlaces oficiales")}
                </p>
                <div className="space-y-1.5">
                  <a
                    href={university.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                  >
                    {t("University website", "Sitio web de la universidad")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {university.admissionsUrl && (
                    <a
                      href={university.admissionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                    >
                      {t("Admissions page", "Página de admisiones")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {university.tags && university.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {university.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UniversityDetailsModal;
