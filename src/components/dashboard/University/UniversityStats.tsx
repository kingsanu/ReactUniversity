"use client";

import React from "react";
import { motion } from "motion/react";
import { UniversityStatsProps } from "@/types/university";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Globe2, GraduationCap, MapPin } from "lucide-react";
import { useGlobalStore } from "@/store/useGlobalStore";

export function UniversityStats({ stats, isLoading }: UniversityStatsProps) {
  const { language } = useGlobalStore();
  const t = (en: string, es: string) => (language === "spanish" ? es : en);

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="h-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const topField = stats.topRecommendedFields[0];
  const topCountry = Object.entries(stats.byCountry)[0]?.[0];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex h-24 flex-col justify-between p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{t("Total matches", "Total coincidencias")}</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.overview.totalMatches}</p>
              <p className="text-[11px] text-muted-foreground">
                {t("Universities that fit your profile", "Universidades alineadas a tu perfil")}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardContent className="flex h-24 flex-col justify-between p-3">
            <p className="text-xs font-medium">{t("Top match", "Mejor coincidencia")}</p>
            <div>
              <p className="text-2xl font-bold">{stats.overview.topMatchScore}</p>
              <p className="text-[11px] text-muted-foreground">
                {t("Highest recommendation score", "Puntaje de recomendación más alto")}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="flex h-24 flex-col justify-between p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{t("Focus area", "Área de enfoque")}</span>
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">
                {topField?.field || t("Not available", "No disponible")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {t("Best-matching field of study", "Campo de estudio con mejor ajuste")}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardContent className="flex h-24 flex-col justify-between p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{t("Top region", "Mejor región")}</span>
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{topCountry || "-"}</p>
              <p className="text-[11px] text-muted-foreground">
                {t("Country with strongest matches", "País con mejores coincidencias")}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default UniversityStats;
