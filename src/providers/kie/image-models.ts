import type { KieModel } from "./interface.js";

// =============================================================================
// IMAGE MODELS - SEEDREAM
// =============================================================================

export const SEEDREAM_3_TEXT_TO_IMAGE: KieModel = {
    modelId: "bytedance/seedream",
    modelName: "Seedream3.0 - Text to Image",
    provider: "Bytedance",
    category: "image",
    description: "Image generation by Seedream3.0",
    docUrl: "https://docs.kie.ai/market/seedream/seedream",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: {
        value: "bytedance/seedream",
        description: "Must be `bytedance/seedream` for this endpoint"
      },
      callBackUrl: {
        type: "string",
        format: "uri",
        required: false,
        description: "The URL to receive generation task completion updates. Optional but recommended for production use.",
        example: "https://your-domain.com/api/callback"
      },
      input: [
        {
          name: "prompt",
          type: "string",
          required: true,
          maxLength: 5000,
          description: "The text prompt used to generate the image (Max length: 5000 characters)",
          example: "A 2D flat art style campsite poster with the text 'Kie AI Seedream 3.0 API'..."
        },
        {
          name: "image_size",
          type: "enum",
          required: false,
          default: "square_hd",
          options: ["square", "square_hd", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"],
          description: "Output image size/aspect ratio",
          example: "square_hd"
        },
        {
          name: "guidance_scale",
          type: "number",
          required: false,
          default: 2.5,
          min: 1,
          max: 10,
          step: 0.1,
          description: "Controls how closely the output image aligns with the input prompt. Higher values mean stronger prompt correlation.",
          example: 2.5
        },
        {
          name: "seed",
          type: "integer",
          required: false,
          description: "Random seed to control the stochasticity of image generation"
        },
        {
          name: "enable_safety_checker",
          type: "boolean",
          required: false,
          description: "If set to true, the safety checker will be enabled",
          example: true
        }
      ]
    }
  };
  
  export const SEEDREAM_4_TEXT_TO_IMAGE: KieModel = {
    modelId: "bytedance/seedream-v4-text-to-image",
    modelName: "Seedream4.0 - Text to Image",
    provider: "Bytedance",
    category: "image",
    description: "High-quality photorealistic image generation powered by Seedream4.0's advanced AI model",
    docUrl: "https://docs.kie.ai/market/seedream/seedream-v4-text-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: {
        value: "bytedance/seedream-v4-text-to-image",
        description: "Must be `bytedance/seedream-v4-text-to-image` for this endpoint"
      },
      callBackUrl: {
        type: "string",
        format: "uri",
        required: false,
        description: "The URL to receive generation task completion updates. Optional but recommended for production use.",
        example: "https://your-domain.com/api/callback"
      },
      input: [
        {
          name: "prompt",
          type: "string",
          required: true,
          maxLength: 5000,
          description: "The text prompt used to generate the image (Max length: 5000 characters)",
          example: "Draw the following system of binary linear equations and the corresponding solution steps on the blackboard: 5x + 2y = 26; 2x -y = 5."
        },
        {
          name: "image_size",
          type: "enum",
          required: false,
          default: "square_hd",
          options: ["square", "square_hd", "portrait_4_3", "portrait_3_2", "portrait_16_9", "landscape_4_3", "landscape_3_2", "landscape_16_9", "landscape_21_9"],
          description: "The size of the generated image",
          example: "square_hd"
        },
        {
          name: "image_resolution",
          type: "enum",
          required: false,
          default: "1K",
          options: ["1K", "2K", "4K"],
          description: "Final image resolution is determined by combining image_size (aspect ratio) and image_resolution (pixel scale). For example, choosing 4:3 + 4K gives 4096 × 3072px",
          example: "1K"
        },
        {
          name: "max_images",
          type: "number",
          required: false,
          default: 1,
          min: 1,
          max: 6,
          step: 1,
          description: "Set this value (1–6) to cap how many images a single generation run can produce in one set—because they're created in one shot rather than separate requests, you must also state the exact number you want in the prompt so both settings align.",
          example: 1
        },
        {
          name: "seed",
          type: "integer",
          required: false,
          description: "Random seed to control the stochasticity of image generation"
        }
      ]
    }
  };
  
  export const SEEDREAM_4_EDIT: KieModel = {
    modelId: "bytedance/seedream-v4-edit",
    modelName: "Seedream4.0 - Edit",
    provider: "Bytedance",
    category: "image",
    description: "Image editing by Seedream4.0",
    docUrl: "https://docs.kie.ai/market/seedream/seedream-v4-edit",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: {
        value: "bytedance/seedream-v4-edit",
        description: "Must be `bytedance/seedream-v4-edit` for this endpoint"
      },
      callBackUrl: {
        type: "string",
        format: "uri",
        required: false,
        description: "The URL to receive generation task completion updates. Optional but recommended for production use.",
        example: "https://your-domain.com/api/callback"
      },
      input: [
        {
          name: "prompt",
          type: "string",
          required: true,
          maxLength: 5000,
          description: "The text prompt describing the editing instructions for the image",
          example: "Refer to this logo and create a single visual showcase for an outdoor sports brand"
        },
        {
          name: "image_urls",
          type: "array",
          required: true,
          description: "Array of image URLs to edit. The images will be processed according to the prompt instructions.",
          example: ["https://example.com/image.png"]
        },
        {
          name: "image_size",
          type: "enum",
          required: false,
          default: "square_hd",
          options: ["square", "square_hd", "portrait_4_3", "portrait_3_2", "portrait_16_9", "landscape_4_3", "landscape_3_2", "landscape_16_9", "landscape_21_9"],
          description: "The size of the generated image",
          example: "square_hd"
        },
        {
          name: "image_resolution",
          type: "enum",
          required: false,
          default: "1K",
          options: ["1K", "2K", "4K"],
          description: "Final image resolution combining with image_size for pixel dimensions",
          example: "1K"
        },
        {
          name: "max_images",
          type: "integer",
          required: false,
          default: 1,
          min: 1,
          max: 6,
          description: "Number of images to generate (1-6)",
          example: 1
        },
        {
          name: "seed",
          type: "integer",
          required: false,
          description: "Random seed to control the stochasticity of image generation"
        }
      ]
    }
  };
  
  export const SEEDREAM_45_TEXT_TO_IMAGE: KieModel = {
    modelId: "seedream/4.5-text-to-image",
    modelName: "Seedream4.5 - Text to Image",
    provider: "Bytedance",
    category: "image",
    description: "High-quality photorealistic image generation powered by Seedream's advanced AI model",
    docUrl: "https://docs.kie.ai/market/seedream/4.5-text-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: {
        value: "seedream/4.5-text-to-image",
        description: "Must be `seedream/4.5-text-to-image` for this endpoint"
      },
      callBackUrl: {
        type: "string",
        format: "uri",
        required: false,
        description: "The URL to receive generation task completion updates. Optional but recommended for production use.",
        example: "https://your-domain.com/api/callback"
      },
      input: [
        {
          name: "prompt",
          type: "string",
          required: true,
          maxLength: 3000,
          description: "A text description of the image you want to generate (Max length: 3000 characters)",
          example: "A full-process cafe design tool for entrepreneurs and designers"
        },
        {
          name: "aspect_ratio",
          type: "enum",
          required: true,
          default: "1:1",
          options: ["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2", "21:9"],
          description: "Width-height ratio of the image, determining its visual form",
          example: "1:1"
        },
        {
          name: "quality",
          type: "enum",
          required: true,
          default: "basic",
          options: ["basic", "high"],
          description: "Basic outputs 2K images, while High outputs 4K images",
          example: "basic"
        }
      ]
    }
  };
  
  export const SEEDREAM_45_EDIT: KieModel = {
    modelId: "seedream/4.5-edit",
    modelName: "Seedream4.5 - Edit",
    provider: "Bytedance",
    category: "image",
    description: "Image editing by Seedream4.5",
    docUrl: "https://docs.kie.ai/market/seedream/4.5-edit",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: {
        value: "seedream/4.5-edit",
        description: "Must be `seedream/4.5-edit` for this endpoint"
      },
      callBackUrl: {
        type: "string",
        format: "uri",
        required: false,
        description: "The URL to receive generation task completion updates. Optional but recommended for production use.",
        example: "https://your-domain.com/api/callback"
      },
      input: [
        {
          name: "prompt",
          type: "string",
          required: true,
          maxLength: 3000,
          description: "A text description of the image you want to generate (Max length: 3000 characters)",
          example: "Keep the model's pose and the flowing shape of the liquid dress unchanged..."
        },
        {
          name: "image_urls",
          type: "array",
          required: true,
          max: 14,
          description: "Upload image URLs to use as input (Accepted types: image/jpeg, image/png, image/webp; Max size: 10.0MB; Max 14 images)",
          example: ["https://example.com/image.webp"]
        },
        {
          name: "aspect_ratio",
          type: "enum",
          required: true,
          default: "1:1",
          options: ["1:1", "4:3", "3:4", "16:9", "9:16", "2:3", "3:2", "21:9"],
          description: "Width-height ratio of the image, determining its visual form",
          example: "1:1"
        },
        {
          name: "quality",
          type: "enum",
          required: true,
          default: "basic",
          options: ["basic", "high"],
          description: "Basic outputs 2K images, while High outputs 4K images",
          example: "basic"
        }
      ]
    }
  };
  
  // =============================================================================
  // IMAGE MODELS - Z-IMAGE
  // =============================================================================
  
  export const Z_IMAGE: KieModel = {
    modelId: "z-image",
    modelName: "z-image",
    provider: "Z-image",
    category: "image",
    description: "Image generation by z-image",
    docUrl: "https://docs.kie.ai/market/z-image/z-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: {
        value: "z-image",
        description: "Must be `z-image` for this endpoint"
      },
      callBackUrl: {
        type: "string",
        format: "uri",
        required: false,
        description: "The URL to receive generation task completion updates. Optional but recommended for production use.",
        example: "https://your-domain.com/api/callback"
      },
      input: [
        {
          name: "prompt",
          type: "string",
          required: true,
          maxLength: 1000,
          description: "A text description of the image you want to generate (Max length: 1000 characters)",
          example: "Generate a photorealistic image of a cafe terrace in the Marais district of Paris"
        },
        {
          name: "aspect_ratio",
          type: "enum",
          required: true,
          default: "1:1",
          options: ["1:1", "4:3", "3:4", "16:9", "9:16"],
          description: "Aspect ratio for the generated image",
          example: "1:1"
        }
      ]
    },
    pricing: { credits: 0.8, kieUsd: 0.004, falUsd: 0.005, discount: -0.2, note: "per image" }
  };
  
  // =============================================================================
  // IMAGE MODELS - GOOGLE
  // =============================================================================
  
  export const GOOGLE_IMAGEN4_FAST: KieModel = {
    modelId: "google/imagen4-fast",
    modelName: "Google - imagen4-fast",
    provider: "Google",
    category: "image",
    description: "Image generation by Google imagen4-fast",
    docUrl: "https://docs.kie.ai/market/google/imagen4-fast",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "google/imagen4-fast", description: "Must be `google/imagen4-fast` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt describing what you want to see (Max length: 5000 characters)", example: "Create a cinematic, photorealistic medium shot" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 5000, description: "A description of what to discourage in the generated images (Max length: 5000 characters)", example: "" },
        { name: "aspect_ratio", type: "enum", required: false, default: "16:9", options: ["1:1", "16:9", "9:16", "3:4", "4:3"], description: "The aspect ratio of the generated image", example: "16:9" },
        { name: "num_images", type: "enum", required: false, default: "1", options: ["1", "2", "3", "4"], description: "Number of images to generate", example: "1" },
        { name: "seed", type: "integer", required: false, description: "Random seed for reproducible generation" }
      ]
    },
    pricing: { credits: 4, kieUsd: 0.02, note: "per request" }
  };
  
  export const GOOGLE_IMAGEN4_ULTRA: KieModel = {
    modelId: "google/imagen4-ultra",
    modelName: "Google - imagen4-ultra",
    provider: "Google",
    category: "image",
    description: "High-quality image generation by Google imagen4-ultra",
    docUrl: "https://docs.kie.ai/market/google/imagen4-ultra",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "google/imagen4-ultra", description: "Must be `google/imagen4-ultra` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt describing what you want to see (Max length: 5000 characters)", example: "A lively comic scene where two colleagues are in an office" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 5000, description: "A description of what to discourage in the generated images (Max length: 5000 characters)", example: "" },
        { name: "aspect_ratio", type: "enum", required: false, default: "1:1", options: ["1:1", "16:9", "9:16", "3:4", "4:3"], description: "The aspect ratio of the generated image", example: "1:1" },
        { name: "seed", type: "string", required: false, maxLength: 500, description: "Random seed for reproducible generation (Max length: 500 characters)", example: "" }
      ]
    },
    pricing: { credits: 12, kieUsd: 0.06, note: "per image" }
  };
  
  export const GOOGLE_IMAGEN4: KieModel = {
    modelId: "google/imagen4",
    modelName: "Google - imagen4",
    provider: "Google",
    category: "image",
    description: "Image generation by Google imagen4",
    docUrl: "https://docs.kie.ai/market/google/imagen4",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "google/imagen4", description: "Must be `google/imagen4` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt describing what you want to see (Max length: 5000 characters)", example: "A lively comic scene where two colleagues are in an office" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 5000, description: "A description of what to discourage in the generated images (Max length: 5000 characters)", example: "" },
        { name: "aspect_ratio", type: "enum", required: false, default: "1:1", options: ["1:1", "16:9", "9:16", "3:4", "4:3"], description: "The aspect ratio of the generated image", example: "1:1" },
        { name: "seed", type: "string", required: false, maxLength: 500, description: "Random seed for reproducible generation (Max length: 500 characters)", example: "" }
      ]
    },
    pricing: { credits: 8, kieUsd: 0.04, note: "per request" }
  };
  
  export const GOOGLE_NANO_BANANA: KieModel = {
    modelId: "google/nano-banana",
    modelName: "Google - Nano Banana",
    provider: "Google",
    category: "image",
    description: "Image generation by Google Nano Banana model",
    docUrl: "https://docs.kie.ai/market/google/nano-banana",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "google/nano-banana", description: "Must be `google/nano-banana` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt for image generation (Max length: 5000 characters)", example: "A surreal painting of a giant banana floating in space" },
        { name: "output_format", type: "enum", required: false, default: "png", options: ["png", "jpeg"], description: "Output format for the images", example: "png" },
        { name: "image_size", type: "enum", required: false, default: "1:1", options: ["1:1", "9:16", "16:9", "3:4", "4:3", "3:2", "2:3", "5:4", "4:5", "21:9", "auto"], description: "Aspect ratio of the generated image", example: "1:1" }
      ]
    },
    pricing: { credits: 4, kieUsd: 0.02, falUsd: 0.039, discount: -0.487, note: "per image" }
  };
  
  export const GOOGLE_NANO_BANANA_EDIT: KieModel = {
    modelId: "google/nano-banana-edit",
    modelName: "Google - Nano Banana Edit",
    provider: "Google",
    category: "image",
    description: "Image editing using Google's Nano Banana Edit model",
    docUrl: "https://docs.kie.ai/market/google/nano-banana-edit",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "google/nano-banana-edit", description: "Must be `google/nano-banana-edit` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt for image editing (Max length: 5000 characters)", example: "turn this photo into a character figure" },
        { name: "image_urls", type: "array", required: true, max: 10, description: "List of URLs of input images for editing, up to 10 images (Accepted types: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: ["https://example.com/image.png"] },
        { name: "output_format", type: "enum", required: false, default: "png", options: ["png", "jpeg"], description: "Output format for the images", example: "png" },
        { name: "image_size", type: "enum", required: false, default: "1:1", options: ["1:1", "9:16", "16:9", "3:4", "4:3", "3:2", "2:3", "5:4", "4:5", "21:9", "auto"], description: "Aspect ratio of the output image", example: "1:1" }
      ]
    },
    pricing: { credits: 4, kieUsd: 0.02, falUsd: 0.039, discount: -0.487, note: "per image" }
  };
  
  export const GOOGLE_PRO_IMAGE_TO_IMAGE: KieModel = {
    modelId: "google/pro-image-to-image",
    modelName: "Google - Pro Image to Image",
    provider: "Google",
    category: "image",
    description: "Image-to-image transformation using Google Pro model",
    docUrl: "https://docs.kie.ai/market/google/pro-image-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "google/pro-image-to-image", description: "Must be `google/pro-image-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "A text description of the image you want to generate (Max length: 10000 characters)", example: "Comic poster: cool banana hero in shades leaps from sci-fi pad" },
        { name: "image_input", type: "array", required: false, max: 8, description: "Input images to transform or use as reference (supports up to 8 images; Accepted types: image/jpeg, image/png, image/webp; Max size: 30.0MB)", example: [] },
        { name: "aspect_ratio", type: "enum", required: false, default: "1:1", options: ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "auto"], description: "Aspect ratio of the generated image", example: "1:1" },
        { name: "resolution", type: "enum", required: false, default: "1K", options: ["1K", "2K", "4K"], description: "Resolution of the generated image", example: "1K" },
        { name: "output_format", type: "enum", required: false, default: "png", options: ["png", "jpg"], description: "Format of the output image", example: "png" }
      ]
    },
    pricing: { credits: 18, kieUsd: 0.09, falUsd: 0.15, note: "1/2K resolution" }
  };
  
  // =============================================================================
  // IMAGE MODELS - FLUX-2 (Black Forest Labs)
  // =============================================================================
  
  export const FLUX2_PRO_TEXT_TO_IMAGE: KieModel = {
    modelId: "flux-2/pro-text-to-image",
    modelName: "Flux-2 - Pro Text to Image",
    provider: "Black Forest Labs",
    category: "image",
    description: "High-quality photorealistic image generation powered by Flux-2's advanced AI model",
    docUrl: "https://docs.kie.ai/market/flux2/pro-text-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "flux-2/pro-text-to-image", description: "Must be `flux-2/pro-text-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, min: 3, description: "Must be between 3 and 5000 characters", example: "Hyperrealistic supermarket blister pack on clean olive green surface" },
        { name: "aspect_ratio", type: "enum", required: true, default: "1:1", options: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "auto"], description: "Aspect ratio for the generated image. Select 'auto' to match the first input image ratio", example: "1:1" },
        { name: "resolution", type: "enum", required: true, default: "1K", options: ["1K", "2K"], description: "Output image resolution", example: "1K" }
      ]
    },
    pricing: { credits: 5, kieUsd: 0.025, falUsd: 0.03, discount: -0.167, note: "1K, 2K=7 credits" }
  };
  
  export const FLUX2_PRO_IMAGE_TO_IMAGE: KieModel = {
    modelId: "flux-2/pro-image-to-image",
    modelName: "Flux-2 - Pro Image to Image",
    provider: "Black Forest Labs",
    category: "image",
    description: "High-quality image-to-image transformation powered by Flux-2",
    docUrl: "https://docs.kie.ai/market/flux2/pro-image-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "flux-2/pro-image-to-image", description: "Must be `flux-2/pro-image-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "input_urls", type: "array", required: true, max: 8, description: "Input reference images (1-8 images; Accepted types: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: ["https://example.com/image.png"] },
        { name: "prompt", type: "string", required: true, maxLength: 5000, min: 3, description: "Must be between 3 and 5000 characters", example: "The jar in image 1 is filled with capsules exactly same as image 2" },
        { name: "aspect_ratio", type: "enum", required: true, default: "1:1", options: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "auto"], description: "Aspect ratio for the generated image. Select 'auto' to match the first input image ratio", example: "1:1" },
        { name: "resolution", type: "enum", required: true, default: "1K", options: ["1K", "2K"], description: "Output image resolution", example: "1K" }
      ]
    },
    pricing: { credits: 5, kieUsd: 0.025, falUsd: 0.045, discount: -0.444, note: "1K, 2K=7 credits" }
  };
  
  export const FLUX2_FLEX_TEXT_TO_IMAGE: KieModel = {
    modelId: "flux-2/flex-text-to-image",
    modelName: "Flux-2 - Flex Text to Image",
    provider: "Black Forest Labs",
    category: "image",
    description: "Flexible text-to-image generation with Flux-2",
    docUrl: "https://docs.kie.ai/market/flux2/flex-text-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "flux-2/flex-text-to-image", description: "Must be `flux-2/flex-text-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, min: 3, description: "Generation prompt, length must be between 3-5000 characters", example: "A humanoid figure with a vintage television set for a head" },
        { name: "aspect_ratio", type: "enum", required: true, default: "1:1", options: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "auto"], description: "Aspect ratio of the generated image. When 'auto' is selected, it will match the ratio of the first input image", example: "1:1" },
        { name: "resolution", type: "enum", required: true, default: "1K", options: ["1K", "2K"], description: "Output image resolution", example: "1K" }
      ]
    },
    pricing: { credits: 14, kieUsd: 0.07, falUsd: 0.12, discount: -0.417, note: "1K, 2K=24 credits" }
  };
  
  export const FLUX2_FLEX_IMAGE_TO_IMAGE: KieModel = {
    modelId: "flux-2/flex-image-to-image",
    modelName: "Flux-2 - Flex Image to Image",
    provider: "Black Forest Labs",
    category: "image",
    description: "Flexible image-to-image transformation with Flux-2",
    docUrl: "https://docs.kie.ai/market/flux2/flex-image-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "flux-2/flex-image-to-image", description: "Must be `flux-2/flex-image-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "input_urls", type: "array", required: true, max: 8, description: "Input reference images (1-8 images; Accepted types: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: ["https://example.com/image.png"] },
        { name: "prompt", type: "string", required: true, maxLength: 5000, min: 3, description: "Must be between 3 and 5000 characters", example: "Replace the can in image 2 with the can from image 1" },
        { name: "aspect_ratio", type: "enum", required: true, default: "1:1", options: ["1:1", "4:3", "3:4", "16:9", "9:16", "3:2", "2:3", "auto"], description: "Aspect ratio for the generated image. Select 'auto' to match the first input image ratio", example: "1:1" },
        { name: "resolution", type: "enum", required: true, default: "1K", options: ["1K", "2K"], description: "Output image resolution", example: "1K" }
      ]
    },
    pricing: { credits: 14, kieUsd: 0.07, falUsd: 0.12, discount: -0.417, note: "1K, 2K=24 credits" }
  };
  
  // =============================================================================
  // IMAGE MODELS - GROK IMAGINE (xAI)
  // =============================================================================
  
  export const GROK_IMAGINE_TEXT_TO_IMAGE: KieModel = {
    modelId: "grok-imagine/text-to-image",
    modelName: "Grok Imagine - Text to Image",
    provider: "xAI",
    category: "image",
    description: "High-quality photorealistic images from text prompts",
    docUrl: "https://docs.kie.ai/market/grok-imagine/text-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "grok-imagine/text-to-image", description: "Must be `grok-imagine/text-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompt describing the desired image. Should be detailed and specific about visual elements, composition, style, lighting, mood.", example: "Cinematic portrait of a woman sitting by a vinyl record player, retro living room background" },
        { name: "aspect_ratio", type: "enum", required: false, default: "1:1", options: ["2:3", "3:2", "1:1", "16:9", "9:16"], description: "Specifies the width-to-height ratio of the generated image", example: "3:2" }
      ]
    },
    pricing: { credits: 4, kieUsd: 0.02, note: "per 6 images" }
  };
  
  export const GROK_IMAGINE_IMAGE_TO_IMAGE: KieModel = {
    modelId: "grok-imagine/image-to-image",
    modelName: "Grok Imagine - Image to Image",
    provider: "xAI",
    category: "image",
    description: "Transform images based on reference and optional prompt",
    docUrl: "https://docs.kie.ai/market/grok-imagine/image-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "grok-imagine/image-to-image", description: "Must be `grok-imagine/image-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image_urls", type: "array", required: true, max: 1, description: "An array containing a single URL string pointing to the reference image (Accepted types: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: ["https://example.com/image.png"] },
        { name: "prompt", type: "string", required: false, maxLength: 390000, description: "A text description specifying the desired content or style of the generated image", example: "Recreate this image in watercolor style" }
      ]
    },
    pricing: { credits: 4, kieUsd: 0.02, note: "per 2 images" }
  };
  
  export const GROK_IMAGINE_UPSCALE: KieModel = {
    modelId: "grok-imagine/upscale",
    modelName: "Grok Imagine - Image Upscale",
    provider: "xAI",
    category: "image",
    description: "Upscale images from previous Kie AI generation tasks",
    docUrl: "https://docs.kie.ai/market/grok-imagine/image-upscale",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "grok-imagine/upscale", description: "Must be `grok-imagine/upscale` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "task_id", type: "string", required: true, maxLength: 100, description: "Task ID from a previously successful image generation task. Must be from a Kie AI image generation model.", example: "task_grok_12345678" }
      ]
    }
  };
  
  // =============================================================================
  // IMAGE MODELS - GPT IMAGE (OpenAI)
  // =============================================================================
  
  export const GPT_IMAGE_15_TEXT_TO_IMAGE: KieModel = {
    modelId: "gpt-image/1.5-text-to-image",
    modelName: "GPT Image 1.5 - Text to Image",
    provider: "OpenAI",
    category: "image",
    description: "Generate images from text using OpenAI GPT Image 1.5",
    docUrl: "https://docs.kie.ai/market/gpt-image/1.5-text-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "gpt-image/1.5-text-to-image", description: "Must be `gpt-image/1.5-text-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, description: "A text description of the image you want to generate", example: "Create a photorealistic candid photograph of an elderly sailor standing on a small fishing boat..." },
        { name: "aspect_ratio", type: "enum", required: true, default: "1:1", options: ["1:1", "2:3", "3:2"], description: "Width-height ratio of the image, determining its visual form", example: "1:1" },
        { name: "quality", type: "enum", required: true, default: "medium", options: ["medium", "high"], description: "Quality: medium=balanced, high=slow/detailed", example: "medium" }
      ]
    },
    pricing: { credits: 4, kieUsd: 0.02, falUsd: 0.034, discount: -0.412, note: "medium, high=22 credits" }
  };
  
  export const GPT_IMAGE_15_IMAGE_TO_IMAGE: KieModel = {
    modelId: "gpt-image/1.5-image-to-image",
    modelName: "GPT Image 1.5 - Image to Image",
    provider: "OpenAI",
    category: "image",
    description: "Edit images using OpenAI GPT Image 1.5",
    docUrl: "https://docs.kie.ai/market/gpt-image/1.5-image-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "gpt-image/1.5-image-to-image", description: "Must be `gpt-image/1.5-image-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "input_urls", type: "array", required: true, max: 16, format: "uri", description: "Upload image files to use as input (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: ["https://static.aiquickdraw.com/tools/example/1765962794374_GhtqB9oX.webp"] },
        { name: "prompt", type: "string", required: true, description: "A text description of the image you want to generate", example: "Edit the image to dress the woman using the provided clothing images..." },
        { name: "aspect_ratio", type: "enum", required: true, default: "3:2", options: ["1:1", "2:3", "3:2"], description: "Width-height ratio of the image, determining its visual form", example: "3:2" },
        { name: "quality", type: "enum", required: true, default: "medium", options: ["medium", "high"], description: "Quality: medium=balanced, high=slow/detailed", example: "medium" }
      ]
    },
    pricing: { credits: 4, kieUsd: 0.02, falUsd: 0.034, discount: -0.412, note: "medium, high=22 credits" }
  };
  
  // =============================================================================
  // IMAGE MODELS - TOPAZ
  // =============================================================================
  
  export const TOPAZ_IMAGE_UPSCALE: KieModel = {
    modelId: "topaz/image-upscale",
    modelName: "Topaz - Image Upscale",
    provider: "Topaz",
    category: "image",
    description: "Upscale images using Topaz AI",
    docUrl: "https://docs.kie.ai/market/topaz/image-upscale",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "topaz/image-upscale", description: "Must be `topaz/image-upscale` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the image to be upscaled (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://static.aiquickdraw.com/tools/example/1762752805607_mErUj1KR.png" },
        { name: "upscale_factor", type: "enum", required: true, default: "2", options: ["1", "2", "4", "8"], description: "Factor to upscale the image by (e.g. 2 doubles width and height)", example: "2" }
      ]
    },
    pricing: { credits: 10, kieUsd: 0.05, note: "2x, 4x=20, 8x=40 credits" }
  };
  
  // =============================================================================
  // IMAGE MODELS - RECRAFT
  // =============================================================================
  
  export const RECRAFT_REMOVE_BACKGROUND: KieModel = {
    modelId: "recraft/remove-background",
    modelName: "Recraft - Remove Background",
    provider: "Recraft",
    category: "image",
    description: "Remove background from images",
    docUrl: "https://docs.kie.ai/market/recraft/remove-background",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "recraft/remove-background", description: "Must be `recraft/remove-background` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image", type: "string", required: true, format: "uri", description: "Image to remove background from (PNG, JPG, WEBP; Max 5MB, max 16MP, max 4096px, min 256px)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1757057285447k9qcbki1.webp" }
      ]
    },
    pricing: { credits: 1, note: "per image" }
  };
  
  export const RECRAFT_CRISP_UPSCALE: KieModel = {
    modelId: "recraft/crisp-upscale",
    modelName: "Recraft - Crisp Upscale",
    provider: "Recraft",
    category: "image",
    description: "Upscale images with crisp detail enhancement",
    docUrl: "https://docs.kie.ai/market/recraft/crisp-upscale",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "recraft/crisp-upscale", description: "Must be `recraft/crisp-upscale` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image", type: "string", required: true, format: "uri", description: "Image to upscale (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1757169577325ijj8vwvt.jpg" }
      ]
    },
    pricing: { credits: 0.5, kieUsd: 0.0025, falUsd: 0.004, discount: -0.375, note: "per image" }
  };
  
  // =============================================================================
  // IMAGE MODELS - IDEOGRAM
  // =============================================================================
  
  export const IDEOGRAM_V3_REFRAME: KieModel = {
    modelId: "ideogram/v3-reframe",
    modelName: "Ideogram V3 - Reframe",
    provider: "Ideogram",
    category: "image",
    description: "Reframe images to different aspect ratios",
    docUrl: "https://docs.kie.ai/market/ideogram/v3-reframe",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "ideogram/v3-reframe", description: "Must be `ideogram/v3-reframe` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image_url", type: "string", required: true, format: "uri", description: "The image URL to reframe (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1757168087001amxesd6e.webp" },
        { name: "image_size", type: "enum", required: true, default: "square_hd", options: ["square", "square_hd", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"], description: "The resolution for the reframed output image", example: "square_hd" },
        { name: "rendering_speed", type: "enum", required: false, default: "BALANCED", options: ["TURBO", "BALANCED", "QUALITY"], description: "The rendering speed to use", example: "BALANCED" },
        { name: "style", type: "enum", required: false, default: "AUTO", options: ["AUTO", "GENERAL", "REALISTIC", "DESIGN"], description: "The style type to generate with. Cannot be used with style_codes", example: "AUTO" },
        { name: "num_images", type: "enum", required: false, default: "1", options: ["1", "2", "3", "4"], description: "Number of images to generate", example: "1" },
        { name: "seed", type: "number", required: false, description: "Seed for the random number generator", example: 0 }
      ]
    },
    pricing: { credits: 7, kieUsd: 0.035, falUsd: 0.06, discount: -0.417, note: "BALANCED, TURBO=3.5, QUALITY=10" }
  };
  
  export const IDEOGRAM_CHARACTER_REMIX: KieModel = {
    modelId: "ideogram/character-remix",
    modelName: "Ideogram - Character Remix",
    provider: "Ideogram",
    category: "image",
    description: "Remix images with character references",
    docUrl: "https://docs.kie.ai/market/ideogram/character-remix",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "ideogram/character-remix", description: "Must be `ideogram/character-remix` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt to remix the image with (Max length: 5000 characters)", example: "A fisheye lens selfie photograph taken at night on an urban street..." },
        { name: "image_url", type: "string", required: true, format: "uri", description: "The image URL to remix (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1755768466167d0tiuc6e.webp" },
        { name: "reference_image_urls", type: "array", required: true, format: "uri", description: "Character reference images (currently only 1 supported; max total 10MB; JPEG, PNG, WebP)", example: ["https://file.aiquickdraw.com/custom-page/akr/section-images/1755768479029sugx0g6f.webp"] },
        { name: "rendering_speed", type: "enum", required: false, default: "BALANCED", options: ["TURBO", "BALANCED", "QUALITY"], description: "The rendering speed to use", example: "BALANCED" },
        { name: "style", type: "enum", required: false, default: "AUTO", options: ["AUTO", "REALISTIC", "FICTION"], description: "The style type to generate with. Cannot be used with style_codes", example: "AUTO" },
        { name: "expand_prompt", type: "boolean", required: false, default: true, description: "Determine if MagicPrompt should be used in generating the request", example: true },
        { name: "image_size", type: "enum", required: false, default: "square_hd", options: ["square", "square_hd", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"], description: "Output image resolution", example: "square_hd" },
        { name: "num_images", type: "enum", required: false, default: "1", options: ["1", "2", "3", "4"], description: "Number of images to generate", example: "1" },
        { name: "seed", type: "integer", required: false, description: "Seed for the random number generator" },
        { name: "strength", type: "number", required: false, default: 0.8, min: 0.1, max: 1, step: 0.1, description: "Strength of the input image in the remix", example: 0.8 },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, default: "", description: "Description of what to exclude from an image", example: "" },
        { name: "image_urls", type: "array", required: false, format: "uri", description: "Style reference images (max total 10MB; JPEG, PNG, WebP)", example: [] },
        { name: "reference_mask_urls", type: "string", required: false, description: "Mask for character references (max total 10MB; JPEG, PNG, WebP)", example: "" }
      ]
    },
    pricing: { credits: 18, kieUsd: 0.09, falUsd: 0.15, discount: -0.4, note: "BALANCED, TURBO=12, QUALITY=24" }
  };
  
  export const IDEOGRAM_CHARACTER: KieModel = {
    modelId: "ideogram/character",
    modelName: "Ideogram - Character",
    provider: "Ideogram",
    category: "image",
    description: "Generate images with character references",
    docUrl: "https://docs.kie.ai/market/ideogram/character",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "ideogram/character", description: "Must be `ideogram/character` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt to fill the masked part of the image (Max length: 5000 characters)", example: "Place the woman from the uploaded portrait, wearing a casual white blouse, in a peaceful garden setting..." },
        { name: "reference_image_urls", type: "array", required: true, format: "uri", description: "Character reference images (currently only 1 supported; max total 10MB; JPEG, PNG, WebP)", example: ["https://file.aiquickdraw.com/custom-page/akr/section-images/1755767145415pvz49dpi.webp"] },
        { name: "rendering_speed", type: "enum", required: false, default: "BALANCED", options: ["TURBO", "BALANCED", "QUALITY"], description: "The rendering speed to use", example: "BALANCED" },
        { name: "style", type: "enum", required: false, default: "AUTO", options: ["AUTO", "REALISTIC", "FICTION"], description: "The style type to generate with. Cannot be used with style_codes", example: "AUTO" },
        { name: "expand_prompt", type: "boolean", required: false, default: true, description: "Determine if MagicPrompt should be used in generating the request", example: true },
        { name: "num_images", type: "enum", required: false, default: "1", options: ["1", "2", "3", "4"], description: "Number of images to generate", example: "1" },
        { name: "image_size", type: "enum", required: false, default: "square_hd", options: ["square", "square_hd", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"], description: "The resolution of the generated image", example: "square_hd" },
        { name: "seed", type: "integer", required: false, description: "Seed for the random number generator" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 5000, default: "", description: "Description of what to exclude from an image", example: "" }
      ]
    },
    pricing: { credits: 18, kieUsd: 0.09, falUsd: 0.15, discount: -0.4, note: "BALANCED, TURBO=12, QUALITY=24" }
  };
  
  export const IDEOGRAM_CHARACTER_EDIT: KieModel = {
    modelId: "ideogram/character-edit",
    modelName: "Ideogram - Character Edit",
    provider: "Ideogram",
    category: "image",
    description: "Edit images with character references using inpainting masks",
    docUrl: "https://docs.kie.ai/market/ideogram/character-edit",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "ideogram/character-edit", description: "Must be `ideogram/character-edit` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt to fill the masked part of the image (Max length: 5000 characters)", example: "A fabulous look head tilted down, looking forward with a smile" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "The image URL to generate from. Needs to match the dimensions of the mask (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17557680349256sa0lk53.webp" },
        { name: "mask_url", type: "string", required: true, format: "uri", description: "The mask URL to inpaint. Needs to match dimensions of input image (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1755768046014ftgvma28.webp" },
        { name: "reference_image_urls", type: "array", required: true, format: "uri", description: "Character reference images (currently only 1 supported; max total 10MB; JPEG, PNG, WebP)", example: ["https://file.aiquickdraw.com/custom-page/akr/section-images/1755768064644jodsmfhq.webp"] },
        { name: "rendering_speed", type: "enum", required: false, default: "BALANCED", options: ["TURBO", "BALANCED", "QUALITY"], description: "The rendering speed to use", example: "BALANCED" },
        { name: "style", type: "enum", required: false, default: "AUTO", options: ["AUTO", "REALISTIC", "FICTION"], description: "The style type to generate with. Cannot be used with style_codes", example: "AUTO" },
        { name: "expand_prompt", type: "boolean", required: false, default: true, description: "Determine if MagicPrompt should be used in generating the request", example: true },
        { name: "num_images", type: "enum", required: false, default: "1", options: ["1", "2", "3", "4"], description: "Number of images to generate", example: "1" },
        { name: "seed", type: "integer", required: false, description: "Seed for the random number generator" }
      ]
    },
    pricing: { credits: 18, kieUsd: 0.09, falUsd: 0.15, discount: -0.4, note: "BALANCED, TURBO=12, QUALITY=24" }
  };
  
  // =============================================================================
  // IMAGE MODELS - QWEN
  // =============================================================================
  
  export const QWEN_TEXT_TO_IMAGE: KieModel = {
    modelId: "qwen/text-to-image",
    modelName: "Qwen - Text to Image",
    provider: "Qwen",
    category: "image",
    description: "Generate images from text using Qwen",
    docUrl: "https://docs.kie.ai/market/qwen/text-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "qwen/text-to-image", description: "Must be `qwen/text-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt to generate the image with (Max length: 5000 characters)", example: "" },
        { name: "image_size", type: "enum", required: false, default: "square_hd", options: ["square", "square_hd", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"], description: "The size of the generated image", example: "square_hd" },
        { name: "num_inference_steps", type: "number", required: false, default: 30, min: 2, max: 250, step: 1, description: "The number of inference steps to perform", example: 30 },
        { name: "seed", type: "integer", required: false, description: "Seed for reproducible generation" },
        { name: "guidance_scale", type: "number", required: false, default: 2.5, min: 0, max: 20, step: 0.1, description: "CFG scale - how closely to follow the prompt", example: 2.5 },
        { name: "enable_safety_checker", type: "boolean", required: false, description: "Enable safety checker (always on in Playground, can disable via API)", example: true },
        { name: "output_format", type: "enum", required: false, default: "png", options: ["png", "jpeg"], description: "The format of the generated image", example: "png" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, description: "The negative prompt for the generation (Max length: 500 characters)", example: " " },
        { name: "acceleration", type: "enum", required: false, default: "none", options: ["none", "regular", "high"], description: "Acceleration level. 'high' recommended for images without text", example: "none" }
      ]
    },
    pricing: { credits: 4, note: "per image" }
  };
  
  export const QWEN_IMAGE_TO_IMAGE: KieModel = {
    modelId: "qwen/image-to-image",
    modelName: "Qwen - Image to Image",
    provider: "Qwen",
    category: "image",
    description: "Transform images using Qwen with text guidance",
    docUrl: "https://docs.kie.ai/market/qwen/image-to-image",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "qwen/image-to-image", description: "Must be `qwen/image-to-image` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt to generate the image with (Max length: 5000 characters)", example: "" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "The reference image to guide the generation (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "" },
        { name: "strength", type: "number", required: false, default: 0.8, min: 0, max: 1, step: 0.01, description: "Denoising strength. 1.0 = fully remake; 0.0 = preserve original", example: 0.8 },
        { name: "output_format", type: "enum", required: false, default: "png", options: ["png", "jpeg"], description: "The format of the generated image", example: "png" },
        { name: "acceleration", type: "enum", required: false, default: "none", options: ["none", "regular", "high"], description: "Acceleration level. 'high' recommended for images without text", example: "none" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, description: "The negative prompt for the generation (Max length: 500 characters)", example: "blurry, ugly" },
        { name: "seed", type: "integer", required: false, description: "Seed for reproducible generation" },
        { name: "num_inference_steps", type: "number", required: false, default: 30, min: 2, max: 250, step: 1, description: "The number of inference steps to perform", example: 30 },
        { name: "guidance_scale", type: "number", required: false, default: 2.5, min: 0, max: 20, step: 0.1, description: "CFG scale - how closely to follow the prompt", example: 2.5 },
        { name: "enable_safety_checker", type: "boolean", required: false, description: "Enable safety checker (always on in Playground, can disable via API)", example: true }
      ]
    },
    pricing: { credits: 4, kieUsd: 0.02, falUsd: 0.03, discount: -0.333, note: "per image" }
  };
  
  export const QWEN_IMAGE_EDIT: KieModel = {
    modelId: "qwen/image-edit",
    modelName: "Qwen - Image Edit",
    provider: "Qwen",
    category: "image",
    description: "Edit images using Qwen",
    docUrl: "https://docs.kie.ai/market/qwen/image-edit",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "qwen/image-edit", description: "Must be `qwen/image-edit` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 2000, description: "The prompt to generate the image with (Max length: 2000 characters)", example: "" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "The URL of the image to edit (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1755603225969i6j87xnw.jpg" },
        { name: "acceleration", type: "enum", required: false, default: "none", options: ["none", "regular", "high"], description: "Acceleration level for image generation", example: "none" },
        { name: "image_size", type: "enum", required: false, default: "landscape_4_3", options: ["square", "square_hd", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"], description: "The size of the generated image", example: "landscape_4_3" },
        { name: "num_inference_steps", type: "number", required: false, default: 25, min: 2, max: 49, step: 1, description: "The number of inference steps to perform", example: 25 },
        { name: "seed", type: "integer", required: false, description: "Seed for reproducible generation" },
        { name: "guidance_scale", type: "number", required: false, default: 4, min: 0, max: 20, step: 0.1, description: "CFG scale - how closely to follow the prompt", example: 4 },
        { name: "sync_mode", type: "boolean", required: false, description: "If true, waits for image generation before returning response", example: false },
        { name: "num_images", type: "enum", required: false, options: ["1", "2", "3", "4"], description: "Number of images to generate" },
        { name: "enable_safety_checker", type: "boolean", required: false, description: "Enable safety checker", example: true },
        { name: "output_format", type: "enum", required: false, default: "png", options: ["jpeg", "png"], description: "The format of the generated image", example: "png" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, description: "The negative prompt for the generation (Max length: 500 characters)", example: "blurry, ugly" }
      ]
    },
    pricing: { credits: 5, kieUsd: 0.03, note: "per megapixel" }
  };
  
  // =============================================================================
  // MODEL REGISTRY
  // =============================================================================
  
  export const KIE_MODELS: Record<string, KieModel> = {
    // Seedream (Bytedance)
    "bytedance/seedream": SEEDREAM_3_TEXT_TO_IMAGE,
    "bytedance/seedream-v4-text-to-image": SEEDREAM_4_TEXT_TO_IMAGE,
    "bytedance/seedream-v4-edit": SEEDREAM_4_EDIT,
    "seedream/4.5-text-to-image": SEEDREAM_45_TEXT_TO_IMAGE,
    "seedream/4.5-edit": SEEDREAM_45_EDIT,
    // Z-image
    "z-image": Z_IMAGE,
    // Google
    "google/imagen4-fast": GOOGLE_IMAGEN4_FAST,
    "google/imagen4-ultra": GOOGLE_IMAGEN4_ULTRA,
    "google/imagen4": GOOGLE_IMAGEN4,
    "google/nano-banana": GOOGLE_NANO_BANANA,
    "google/nano-banana-edit": GOOGLE_NANO_BANANA_EDIT,
    "google/pro-image-to-image": GOOGLE_PRO_IMAGE_TO_IMAGE,
    // Flux-2 (Black Forest Labs)
    "flux-2/pro-text-to-image": FLUX2_PRO_TEXT_TO_IMAGE,
    "flux-2/pro-image-to-image": FLUX2_PRO_IMAGE_TO_IMAGE,
    "flux-2/flex-text-to-image": FLUX2_FLEX_TEXT_TO_IMAGE,
    "flux-2/flex-image-to-image": FLUX2_FLEX_IMAGE_TO_IMAGE,
    // Grok Imagine (xAI)
    "grok-imagine/text-to-image": GROK_IMAGINE_TEXT_TO_IMAGE,
    "grok-imagine/image-to-image": GROK_IMAGINE_IMAGE_TO_IMAGE,
    "grok-imagine/upscale": GROK_IMAGINE_UPSCALE,
    // GPT Image (OpenAI)
    "gpt-image/1.5-text-to-image": GPT_IMAGE_15_TEXT_TO_IMAGE,
    "gpt-image/1.5-image-to-image": GPT_IMAGE_15_IMAGE_TO_IMAGE,
    // Topaz
    "topaz/image-upscale": TOPAZ_IMAGE_UPSCALE,
    // Recraft
    "recraft/remove-background": RECRAFT_REMOVE_BACKGROUND,
    "recraft/crisp-upscale": RECRAFT_CRISP_UPSCALE,
    // Ideogram
    "ideogram/v3-reframe": IDEOGRAM_V3_REFRAME,
    "ideogram/character-remix": IDEOGRAM_CHARACTER_REMIX,
    "ideogram/character": IDEOGRAM_CHARACTER,
    "ideogram/character-edit": IDEOGRAM_CHARACTER_EDIT,
    // Qwen
    "qwen/text-to-image": QWEN_TEXT_TO_IMAGE,
    "qwen/image-to-image": QWEN_IMAGE_TO_IMAGE,
    "qwen/image-edit": QWEN_IMAGE_EDIT,
  };
  