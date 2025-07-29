import { useState, useEffect } from "react";
import { getPCAResult, getPCACompetences } from "@/services/pcaService";

export interface PCAData {
  pcaCod: string;
  results?: any;
  competences?: any;
  lastUpdated?: string;
  isCompleted: boolean;
}

export function usePCAData() {
  const [pcaData, setPcaData] = useState<PCAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPCAData = async (pcaCod?: string) => {
    // Get PCA code from localStorage or parameter
    const userPcaCod = pcaCod || localStorage.getItem("userPcaCod");

    if (!userPcaCod) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get both results and competences
      const [results, competences] = await Promise.all([
        getPCAResult(userPcaCod).catch(() => null),
        getPCACompetences(userPcaCod).catch(() => null),
      ]);

      if (results || competences) {
        const data: PCAData = {
          pcaCod: userPcaCod,
          results,
          competences,
          lastUpdated: new Date().toISOString(),
          isCompleted: true,
        };

        setPcaData(data);

        // Cache the data
        localStorage.setItem("pcaData", JSON.stringify(data));
      } else {
        // PCA exists but no results yet (assessment not completed)
        setPcaData({
          pcaCod: userPcaCod,
          isCompleted: false,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PCA data");
    } finally {
      setLoading(false);
    }
  };

  const savePCACode = (pcaCod: string) => {
    localStorage.setItem("userPcaCod", pcaCod);
    setPcaData({
      pcaCod,
      isCompleted: false,
    });
  };

  const clearPCAData = () => {
    localStorage.removeItem("userPcaCod");
    localStorage.removeItem("pcaData");
    setPcaData(null);
  };

  const refreshPCAData = () => {
    const cachedData = localStorage.getItem("pcaData");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setPcaData(parsed);
      } catch (e) {
        // Invalid cached data, reload from API
        loadPCAData();
      }
    } else {
      loadPCAData();
    }
  };

  useEffect(() => {
    // Try to load cached data first
    const cachedData = localStorage.getItem("pcaData");
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setPcaData(parsed);
        setLoading(false);

        // Optionally refresh from API in background
        loadPCAData(parsed.pcaCod);
      } catch (e) {
        // Invalid cached data, load from API
        loadPCAData();
      }
    } else {
      loadPCAData();
    }
  }, []);

  return {
    pcaData,
    loading,
    error,
    loadPCAData,
    savePCACode,
    clearPCAData,
    refreshPCAData,
    hasPCA: !!pcaData?.pcaCod,
    isCompleted: pcaData?.isCompleted || false,
  };
}
