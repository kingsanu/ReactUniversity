// PCA Assessment Service for Nexa Developments API

export interface PCAAssessmentRequest {
  CoKey: string;
  PerNom: string;
  PerApe: string;
  PerNumIde: string;
  PerGen: "M" | "F";
  permail: string;
  JcaCod?: string;
  BillingCenter?: string;
  UserMail: string;
}

export interface PCAAuthRequest {
  CoKey: string;
}

export interface PCAResultRequest {
  CoKey: string;
  PcaCod: string;
}

export interface PCACompetencesRequest {
  CoKey: string;
  PcaCod: string;
  CmpTims: string; // "1" for tims, "0" for Org
}

export interface PCAVsJCARequest {
  CoKey: string;
  PcaCod: string;
  JcaCodExt: string;
  AnlsTip: string;
}

export interface PCAAssessmentResponse {
  success: boolean;
  data?: any;
  message?: string;
  assessmentUrl?: string;
  pcaCod?: string;
}

export interface PCAAPIResponse {
  PcaCod: string;
  PcaLink: string;
}

// Nexa Developments API Configuration
const NEXA_API_BASE_URL = "https://timshr.com/core/api";
const NEXA_COKEY = "8A38EEAA-9B94-474D-BE6A-0AB193DDD98D"; // Nexa Developments CoKey

/**
 * Authenticate with Nexa Developments API
 */
export async function authenticateNexaAPI(): Promise<any> {
  try {
    const response = await fetch(`${NEXA_API_BASE_URL}/login/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CoKey: NEXA_COKEY,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Nexa API Authentication Error:", error);
    throw error;
  }
}

/**
 * Add PCA Assessment (Spanish)
 */
export async function addPCAAssessmentSpanish(
  userData: Omit<PCAAssessmentRequest, "CoKey">
): Promise<PCAAssessmentResponse> {
  try {
    const response = await fetch(`${NEXA_API_BASE_URL}/surveys/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CoKey: "NXDAPS", // Spanish PCA format
        ...userData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add PCA assessment: ${response.status}`);
    }

    const data: PCAAPIResponse = await response.json();
    return {
      success: true,
      data,
      assessmentUrl: data.PcaLink,
      pcaCod: data.PcaCod,
    };
  } catch (error) {
    console.error("Add PCA Assessment Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add PCA assessment",
    };
  }
}

/**
 * Add PCA Assessment (English)
 */
export async function addPCAAssessmentEnglish(
  userData: Omit<PCAAssessmentRequest, "CoKey">
): Promise<PCAAssessmentResponse> {
  try {
    const response = await fetch(`${NEXA_API_BASE_URL}/surveys/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CoKey: "NXDAPI", // English PCA format
        ...userData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add PCA assessment: ${response.status}`);
    }

    const data: PCAAPIResponse = await response.json();
    return {
      success: true,
      data,
      assessmentUrl: data.PcaLink,
      pcaCod: data.PcaCod,
    };
  } catch (error) {
    console.error("Add PCA Assessment Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to add PCA assessment",
    };
  }
}

/**
 * Get PCA Result
 */
export async function getPCAResult(pcaCod: string): Promise<any> {
  try {
    const response = await fetch(`${NEXA_API_BASE_URL}/Pca/GetPcaResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CoKey: NEXA_COKEY,
        PcaCod: pcaCod,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get PCA result: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get PCA Result Error:", error);
    throw error;
  }
}

/**
 * Get PCA Competences
 */
export async function getPCACompetences(
  pcaCod: string,
  cmpTims: "1" | "0" = "1"
): Promise<any> {
  try {
    const response = await fetch(
      `${NEXA_API_BASE_URL}/Pca/GetCompetencesResult`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CoKey: NEXA_COKEY,
          PcaCod: pcaCod,
          CmpTims: cmpTims,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get PCA competences: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get PCA Competences Error:", error);
    throw error;
  }
}

/**
 * Get PCA vs JCA Analysis (Gap Analysis)
 */
export async function getPCAVsJCAAnalysis(
  pcaCod: string,
  jcaCodExt: string,
  anlsTip: string = "g"
): Promise<any> {
  try {
    const response = await fetch(`${NEXA_API_BASE_URL}/Pca/GetPcaVsJcaResult`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CoKey: NEXA_COKEY,
        PcaCod: pcaCod,
        JcaCodExt: jcaCodExt,
        AnlsTip: anlsTip,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get PCA vs JCA analysis: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get PCA vs JCA Analysis Error:", error);
    throw error;
  }
}

/**
 * Available JCA Codes for Gap Analysis
 */
export const JCA_CODES = {
  GTCML: "Gerente Comercial",
  ASCML: "Asesor Comercial",
  GEFCR: "Gerente Financiero",
} as const;

export type JCACode = keyof typeof JCA_CODES;
