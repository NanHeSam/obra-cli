
// =============================================================================
// TYPES
// =============================================================================

export interface KieParam {
    name: string;
    type: "string" | "number" | "integer" | "boolean" | "enum" | "array";
    required: boolean;
    default?: any;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    maxLength?: number;
    format?: string; // e.g., "uri"
    description: string;
    example?: any;
  }
  
  export interface KieModel {
    // Model identification
    modelId: string;
    modelName: string;
    provider: string;
    category: "image" | "video";
  
    // Documentation
    description: string;
    docUrl: string;
  
    // API structure
    endpoint: string;
    method: "POST";
  
    // Parameters
    params: {
      model: {
        value: string;
        description: string;
      };
      callBackUrl: {
        type: "string";
        format: "uri";
        required: boolean;
        description: string;
        example: string;
      };
      input: KieParam[];
    };
  
    // Pricing (from pricing spreadsheet)
    pricing?: {
      credits: number;
      kieUsd?: number;
      falUsd?: number;
      discount?: number;
      note?: string; // For variable pricing (resolution, quality, etc.)
    };
  }