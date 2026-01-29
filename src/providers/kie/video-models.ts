import type { KieModel } from "./interface.js";

export const GROK_IMAGINE_TEXT_TO_VIDEO: KieModel = {
    modelId: "grok-imagine/text-to-video",
    modelName: "Grok Imagine - Text to Video",
    provider: "xAI",
    category: "video",
    description: "Generate videos from text prompts using Grok Imagine",
    docUrl: "https://docs.kie.ai/market/grok-imagine/text-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "grok-imagine/text-to-video", description: "Must be `grok-imagine/text-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompt describing the desired video motion. Should be detailed and specific about the desired visual motion, movement, action sequences, camera work, and timing. Supports English language prompts (Max length: 5000 characters)", example: "A couple of doors open to the right one by one randomly and stay open, to show the inside, each is either a living room, or a kitchen, or a bedroom or an office, with little people living inside." },
        { name: "aspect_ratio", type: "enum", required: false, default: "2:3", options: ["2:3", "3:2", "1:1", "16:9", "9:16"], description: "Specifies the width-to-height ratio of the generated video", example: "2:3" },
        { name: "mode", type: "enum", required: false, default: "normal", options: ["fun", "normal", "spicy"], description: "Generation mode affecting style and intensity of motion. 'fun' = more creative/playful, 'normal' = balanced, 'spicy' = more dynamic/intense", example: "normal" }
      ]  },
    pricing: { credits: 20, kieUsd: 0.1 }
  };
  
  export const GROK_IMAGINE_IMAGE_TO_VIDEO: KieModel = {
    modelId: "grok-imagine/image-to-video",
    modelName: "Grok Imagine - Image to Video",
    provider: "xAI",
    category: "video",
    description: "Generate videos from images using Grok Imagine",
    docUrl: "https://docs.kie.ai/market/grok-imagine/image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "grok-imagine/image-to-video", description: "Must be `grok-imagine/image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image_urls", type: "array", required: false, max: 1, format: "uri", description: "An array containing a single URL pointing to the reference image. Do not use with task_id. (Accepted: image/jpeg, image/png, image/webp; Max size: 10MB)", example: ["https://file.aiquickdraw.com/custom-page/akr/section-images/1762247692373tw5di116.png"] },
        { name: "task_id", type: "string", required: false, maxLength: 100, description: "Task ID from a previously generated Grok image. Use with index to select a specific image. Do not use with image_urls. Supports all modes including Spicy.", example: "task_grok_12345678" },
        { name: "index", type: "integer", required: false, default: 0, min: 0, max: 5, description: "When using task_id, specify which image to use (0-5). Grok generates 6 images per task. Ignored if image_urls is provided.", example: 0 },
        { name: "prompt", type: "string", required: false, maxLength: 5000, description: "Text prompt describing the desired video motion. Should be detailed about movement, action sequences, camera work, and timing (Max length: 5000 characters)", example: "POV hand comes into frame handing the girl a cup of take away coffee, the girl steps out of the screen looking tired, then takes it and she says happily: \"thanks! Back to work\" she exits the frame and walks right to a different part of the office." },
        { name: "mode", type: "enum", required: false, default: "normal", options: ["fun", "normal", "spicy"], description: "Generation mode affecting style and intensity of motion. Note: Spicy mode is not available for external image inputs.", example: "normal" }
      ]
    },
    pricing: { credits: 20, kieUsd: 0.1 }
  };
  
  // =============================================================================
  // VIDEO MODELS - KLING 2.6 (Kuaishou)
  // =============================================================================
  
  export const KLING_26_TEXT_TO_VIDEO: KieModel = {
    modelId: "kling-2.6/text-to-video",
    modelName: "Kling 2.6 - Text to Video",
    provider: "Kuaishou",
    category: "video",
    description: "Generate videos from text prompts using Kling 2.6",
    docUrl: "https://docs.kie.ai/market/kling/2.6-text-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling-2.6/text-to-video", description: "Must be `kling-2.6/text-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 1000, description: "Text prompt for video generation (Max length: 1000 characters)", example: "Scene: A fashion live-streaming sales setting, with clothes hanging on racks and the host's figure reflected in a full-length mirror. Lines: [African female host] turns around to showcase the hoodie's cut. [African female host, in a cheerful tone] says: \"360-degree flawless tailoring, slimming and versatile.\" She then [African female host] leans closer to the camera. [African female host, in a lively tone] says: \"Double-sided fleece fabric, $30 off immediately when you order now.\"" },
        { name: "sound", type: "boolean", required: true, description: "Specifies whether the generated video contains sound", example: false },
        { name: "aspect_ratio", type: "enum", required: true, default: "1:1", options: ["1:1", "16:9", "9:16"], description: "The video aspect ratio", example: "1:1" },
        { name: "duration", type: "enum", required: true, default: "5", options: ["5", "10"], description: "Video duration in seconds", example: "5" }
      ]  },
    pricing: { credits: 55, kieUsd: 0.275, falUsd: 0.35, discount: -0.214 }
  };
  
  export const KLING_26_IMAGE_TO_VIDEO: KieModel = {
    modelId: "kling-2.6/image-to-video",
    modelName: "Kling 2.6 - Image to Video",
    provider: "Kuaishou",
    category: "video",
    description: "Generate videos from images using Kling 2.6",
    docUrl: "https://docs.kie.ai/market/kling/2.6-image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling-2.6/image-to-video", description: "Must be `kling-2.6/image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 1000, description: "Text prompt for video generation (Max length: 1000 characters)", example: "In a bright rehearsal room, sunlight streams through the windows, and a standing microphone is placed in the center of the room. [Campus band female lead singer] stands in front of the microphone with her eyes closed, and other members stand around her. [Campus band female lead singer, singing loudly] Lead vocal: \"I will do my best to heal you, with all my heart and soul...\" The background is a cappella harmonies, and the camera slowly pans around the band members." },
        { name: "image_urls", type: "array", required: true, max: 1, format: "uri", description: "Image URLs for video generation (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: ["https://static.aiquickdraw.com/tools/example/1764851002741_i0lEiI8I.png"] },
        { name: "sound", type: "boolean", required: true, description: "Specifies whether the generated video contains sound", example: false },
        { name: "duration", type: "enum", required: true, default: "5", options: ["5", "10"], description: "Video duration in seconds", example: "5" }
      ]
    },
    pricing: { credits: 55, kieUsd: 0.275, falUsd: 0.35, discount: -0.214 }
  };
  
  export const KLING_26_MOTION_CONTROL: KieModel = {
    modelId: "kling-2.6/motion-control",
    modelName: "Kling 2.6 - Motion Control",
    provider: "Kuaishou",
    category: "video",
    description: "Generate videos with motion control using reference video",
    docUrl: "https://docs.kie.ai/market/kling/2.6-motion-control",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling-2.6/motion-control", description: "Must be `kling-2.6/motion-control` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "input_urls", type: "array", required: true, max: 1, format: "uri", description: "An array containing a single image URL. The photo must clearly show the subject's head, shoulders, and torso (Accepted: image/jpeg, image/png, image/jpg; Max size: 10.0MB; size > 300px, aspect ratio 2:5 to 5:2)", example: ["https://static.aiquickdraw.com/tools/example/1767694885407_pObJoMcy.png"] },
        { name: "video_urls", type: "array", required: true, max: 1, format: "uri", description: "An array containing a single video URL. Duration must be 3-30 seconds, clearly showing subject's head, shoulders, and torso (Accepted: video/mp4, video/quicktime, video/x-matroska; Max size: 100.0MB)", example: ["https://static.aiquickdraw.com/tools/example/1767525918769_QyvTNib2.mp4"] },
        { name: "character_orientation", type: "enum", required: true, default: "video", options: ["image", "video"], description: "Orientation of characters in the output. 'image' = same as picture (max 10s), 'video' = same as reference video (max 30s)", example: "video" },
        { name: "mode", type: "enum", required: true, default: "720p", options: ["720p", "1080p"], description: "Output resolution mode. '720p' for standard, '1080p' for pro quality", example: "720p" },
        { name: "prompt", type: "string", required: false, maxLength: 2500, description: "A text description of the desired output (Max length: 2500 characters)", example: "The cartoon character is dancing." }
      ]
    },
    pricing: { credits: 6, kieUsd: 0.03, falUsd: 0.07, discount: -0.571 }
  };
  
  // =============================================================================
  // VIDEO MODELS - KLING V2.5 TURBO (Kuaishou)
  // =============================================================================
  
  export const KLING_V25_TURBO_IMAGE_TO_VIDEO_PRO: KieModel = {
    modelId: "kling/v2-5-turbo-image-to-video-pro",
    modelName: "Kling V2.5 Turbo - Image to Video Pro",
    provider: "Kuaishou",
    category: "video",
    description: "High-quality image-to-video generation with Kling V2.5 Turbo Pro",
    docUrl: "https://docs.kie.ai/market/kling/v2-5-turbo-image-to-video-pro",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling/v2-5-turbo-image-to-video-pro", description: "Must be `kling/v2-5-turbo-image-to-video-pro` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 2500, description: "Text description for the video generation (Max length: 2500 characters)", example: "Astronaut instantly teleports through a glowing magical wooden door. Handheld tracking, camera stays 5–10 meters above and behind, smooth third-person chase. Hyper-realistic base, each scene with distinct art style, instant scene flashes with bright portal glow, high detail, 8K, epic orchestral undertones." },
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the image to be used for the video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1759211376283gfcw5zcy.png" },
        { name: "tail_image_url", type: "string", required: false, format: "uri", description: "Tail frame image of video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 2496, description: "Elements to avoid in the video (Max length: 2496 characters)", example: "blur, distort, and low quality" },
        { name: "cfg_scale", type: "number", required: false, default: 0.5, min: 0, max: 1, step: 0.1, description: "CFG scale - how closely to follow the prompt (0-1)", example: 0.5 }
      ]
    },
    pricing: { credits: 42, kieUsd: 0.21, falUsd: 0.35, discount: -0.4 }
  };
  
  export const KLING_V25_TURBO_TEXT_TO_VIDEO_PRO: KieModel = {
    modelId: "kling/v2-5-turbo-text-to-video-pro",
    modelName: "Kling V2.5 Turbo - Text to Video Pro",
    provider: "Kuaishou",
    category: "video",
    description: "High-quality text-to-video generation with Kling V2.5 Turbo Pro",
    docUrl: "https://docs.kie.ai/market/kling/v2-5-turbo-text-to-video-pro",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling/v2-5-turbo-text-to-video-pro", description: "Must be `kling/v2-5-turbo-text-to-video-pro` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 2500, description: "The text description of the video you want to generate (Max length: 2500 characters)", example: "Real-time playback. Wide shot of a ruined city: collapsed towers, fires blazing, storm clouds with lightning. Camera drops fast from the sky over burning streets and tilted buildings. Smoke and dust fill the air. A lone hero walks out of the ruins, silhouetted by fire. Camera shifts front: his face is dirty with dust and sweat, eyes firm, a faint smile. Wind blows, debris rises. Extreme close-up: his eyes reflect the approaching enemy. Music and drums hit. Final wide shot: fire forms a blazing halo behind him — reborn in flames with epic cinematic vibe." },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "aspect_ratio", type: "enum", required: false, default: "16:9", options: ["16:9", "9:16", "1:1"], description: "The aspect ratio of the generated video frame", example: "16:9" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 2500, description: "Things to avoid in the generated video (Max length: 2500 characters)", example: "blur, distort, and low quality" },
        { name: "cfg_scale", type: "number", required: false, default: 0.5, min: 0, max: 1, step: 0.1, description: "CFG scale - how closely to follow the prompt (0-1)", example: 0.5 }
      ]  },
    pricing: { credits: 42, kieUsd: 0.21, falUsd: 0.35, discount: -0.4 }
  };
  
  // =============================================================================
  // VIDEO MODELS - KLING AI AVATAR (Kuaishou)
  // =============================================================================
  
  export const KLING_AI_AVATAR_STANDARD: KieModel = {
    modelId: "kling/ai-avatar-standard",
    modelName: "Kling - AI Avatar Standard",
    provider: "Kuaishou",
    category: "video",
    description: "Generate AI avatar videos with lip-sync from audio",
    docUrl: "https://docs.kie.ai/market/kling/ai-avatar-standard",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling/ai-avatar-standard", description: "Must be `kling/ai-avatar-standard` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image_url", type: "string", required: true, format: "uri", description: "The URL of the image to use as your avatar (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17579268936223zs9l3dt.png" },
        { name: "audio_url", type: "string", required: true, format: "uri", description: "The URL of the audio file (Accepted: audio/mpeg, audio/wav, audio/x-wav, audio/aac, audio/mp4, audio/ogg; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17579258340109gghun47.mp3" },
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt to use for the video generation (Max length: 5000 characters)", example: "" }
      ]
    },
    pricing: { credits: 8, kieUsd: 0.04, falUsd: 0.0562, discount: -0.288 }
  };
  
  export const KLING_AI_AVATAR_PRO: KieModel = {
    modelId: "kling/ai-avatar-pro",
    modelName: "Kling - AI Avatar Pro",
    provider: "Kuaishou",
    category: "video",
    description: "Generate high-quality AI avatar videos with lip-sync from audio",
    docUrl: "https://docs.kie.ai/market/kling/ai-avatar-pro",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling/ai-avatar-pro", description: "Must be `kling/ai-avatar-pro` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image_url", type: "string", required: true, format: "uri", description: "The URL of the image to use as your avatar (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/175792685809077e8h8k3.png" },
        { name: "audio_url", type: "string", required: true, format: "uri", description: "The URL of the audio file (Accepted: audio/mpeg, audio/wav, audio/x-wav, audio/aac, audio/mp4, audio/ogg; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1757925802302srqfkcqh.mp3" },
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The prompt to use for the video generation (Max length: 5000 characters)", example: "" }
      ]
    },
    pricing: { credits: 16, kieUsd: 0.08, falUsd: 0.115, discount: -0.304 }
  };
  
  // =============================================================================
  // VIDEO MODELS - KLING V2.1 MASTER (Kuaishou)
  // =============================================================================
  
  export const KLING_V21_MASTER_IMAGE_TO_VIDEO: KieModel = {
    modelId: "kling/v2-1-master-image-to-video",
    modelName: "Kling V2.1 Master - Image to Video",
    provider: "Kuaishou",
    category: "video",
    description: "Master-quality image-to-video generation with Kling V2.1",
    docUrl: "https://docs.kie.ai/market/kling/v2-1-master-image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling/v2-1-master-image-to-video", description: "Must be `kling/v2-1-master-image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt describing the video to generate (Max length: 5000 characters)", example: "A team of paratroopers descends into enemy territory, as they pass through clouds, the camera switches to a slow pan above the battlefield lighting up with" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the image to be used for the video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1755256297923kmjpynul.png" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, description: "Negative prompt to exclude certain elements from the video (Max length: 500 characters)", example: "blur, distort, and low quality" },
        { name: "cfg_scale", type: "number", required: false, default: 0.5, min: 0, max: 1, step: 0.1, description: "CFG scale - how closely to follow the prompt (0-1)", example: 0.5 }
      ]
    },
    pricing: { credits: 160, kieUsd: 0.8, falUsd: 1.4, discount: -0.429 }
  };
  
  export const KLING_V21_MASTER_TEXT_TO_VIDEO: KieModel = {
    modelId: "kling/v2-1-master-text-to-video",
    modelName: "Kling V2.1 Master - Text to Video",
    provider: "Kuaishou",
    category: "video",
    description: "Master-quality text-to-video generation with Kling V2.1",
    docUrl: "https://docs.kie.ai/market/kling/v2-1-master-text-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling/v2-1-master-text-to-video", description: "Must be `kling/v2-1-master-text-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt describing the video you want to generate (Max length: 5000 characters)", example: "First-person view from a soldier jumping from a transport plane — the camera shakes with turbulence, oxygen mask reflections flicker — as the clouds part, the battlefield below pulses with anti-air fire and missile trails." },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "aspect_ratio", type: "enum", required: false, default: "16:9", options: ["16:9", "9:16", "1:1"], description: "The aspect ratio of the generated video frame", example: "16:9" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, description: "Elements to avoid in the generated video (Max length: 500 characters)", example: "blur, distort, and low quality" },
        { name: "cfg_scale", type: "number", required: false, default: 0.5, min: 0, max: 1, step: 0.1, description: "CFG scale - how closely to follow the prompt (0-1)", example: 0.5 }
      ]  },
    pricing: { credits: 160, kieUsd: 0.8, falUsd: 1.4, discount: -0.429 }
  };
  
  // =============================================================================
  // VIDEO MODELS - KLING V2.1 (Kuaishou)
  // =============================================================================
  
  export const KLING_V21_PRO: KieModel = {
    modelId: "kling/v2-1-pro",
    modelName: "Kling V2.1 - Pro",
    provider: "Kuaishou",
    category: "video",
    description: "Pro-quality image-to-video generation with Kling V2.1",
    docUrl: "https://docs.kie.ai/market/kling/v2-1-pro",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling/v2-1-pro", description: "Must be `kling/v2-1-pro` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompt describing the video to generate (Max length: 5000 characters)", example: "POV shot of a gravity surfer diving between ancient ruins suspended midair, glowing moss lights the path, the board hisses as it carves through thin mist, echoes rise with speed" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the image to be used for the video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1754892534386c8wt0qfs.webp" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, description: "Terms to avoid in the generated video (Max length: 500 characters)", example: "blur, distort, and low quality" },
        { name: "cfg_scale", type: "number", required: false, default: 0.5, min: 0, max: 1, step: 0.1, description: "CFG scale - how closely to follow the prompt (0-1)", example: 0.5 },
        { name: "tail_image_url", type: "string", required: false, format: "uri", description: "URL of the image to be used for the end of the video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "" }
      ]
    },
    pricing: { credits: 50, kieUsd: 0.25, falUsd: 0.45, discount: -0.444 }
  };
  
  export const KLING_V21_STANDARD: KieModel = {
    modelId: "kling/v2-1-standard",
    modelName: "Kling V2.1 - Standard",
    provider: "Kuaishou",
    category: "video",
    description: "Standard-quality image-to-video generation with Kling V2.1",
    docUrl: "https://docs.kie.ai/market/kling/v2-1-standard",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "kling/v2-1-standard", description: "Must be `kling/v2-1-standard` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompt describing the desired video content (Max length: 5000 characters)", example: "Begin with the uploaded image as the first frame. Gradually animate the scene: steam rises and drifts upward from the train; lantern lights flicker subtly; cloaked figures begin to move slowly — walking, turning, adjusting their belongings. Floating dust or magical particles catch the light. The text \"KLING 2.1 STANDARD API — Now on Kie.ai\" softly pulses with a golden glow. The camera pushes forward slightly, then slowly fades to black." },
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the image to be used for the video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1755256596169mkkwr2ag.webp" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, description: "Description of elements to avoid in the generated video (Max length: 500 characters)", example: "blur, distort, and low quality" },
        { name: "cfg_scale", type: "number", required: false, default: 0.5, min: 0, max: 1, step: 0.1, description: "CFG scale - how closely to follow the prompt (0-1)", example: 0.5 }
      ]
    },
    pricing: { credits: 25, kieUsd: 0.125, falUsd: 0.25, discount: -0.5 }
  };
  
  // =============================================================================
  // VIDEO MODELS - BYTEDANCE SEEDANCE
  // =============================================================================
  
  export const BYTEDANCE_SEEDANCE_15_PRO: KieModel = {
    modelId: "bytedance/seedance-1.5-pro",
    modelName: "Bytedance Seedance 1.5 Pro",
    provider: "Bytedance",
    category: "video",
    description: "Seedance 1.5 Pro is ByteDance's audio-video generation model that creates cinema-quality video, synchronized audio, and multilingual dialogue with cinematic camera control",
    docUrl: "https://docs.kie.ai/market/bytedance/seedance-1.5-pro",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "bytedance/seedance-1.5-pro", description: "Must be `bytedance/seedance-1.5-pro` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, min: 3, maxLength: 2500, description: "The text prompt used to generate the video (Min: 3, Max: 2500 characters)", example: "A serene beach at sunset with waves gently crashing on the shore, palm trees swaying in the breeze, and seagulls flying across the orange sky" },
        { name: "aspect_ratio", type: "enum", required: true, default: "1:1", options: ["1:1", "4:3", "3:4", "16:9", "9:16", "21:9"], description: "Video aspect ratio configuration", example: "1:1" },
        { name: "input_urls", type: "array", required: false, max: 2, format: "uri", description: "URLs of input images for image-to-video generation. If not provided, performs text-to-video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB per image)", example: ["https://file.aiquickdraw.com/custom-page/akr/section-images/example1.png"] },
        { name: "resolution", type: "enum", required: false, default: "720p", options: ["480p", "720p", "1080p"], description: "Video resolution - 480p for faster generation, 720p for balance, 1080p for higher quality", example: "720p" },
        { name: "duration", type: "enum", required: false, default: "8", options: ["4", "8", "12"], description: "Duration of the video in seconds", example: "8" },
        { name: "fixed_lens", type: "boolean", required: false, default: false, description: "Enable to lock the camera for stable, static shots. Seedance adds dynamic camera movement by default.", example: false },
        { name: "generate_audio", type: "boolean", required: false, default: false, description: "Whether to generate audio for the video. Enabling audio will increase generation cost.", example: false }
      ]
    },
    pricing: {
      credits: 3.5,
      kieUsd: 0.0175,
      note: "per second. 480p no-audio: 1.58-1.75 cr ($0.0079-$0.0088); 480p audio: 3.17-3.5 cr ($0.0158-$0.0175); 720p no-audio: 3.5 cr ($0.0175); 720p audio: 7 cr ($0.035). Based on 4s/8s/12s tiers."
    }
  };
  
  // =============================================================================
  // VIDEO MODELS - BYTEDANCE V1 PRO
  // =============================================================================
  
  export const BYTEDANCE_V1_PRO_FAST_IMAGE_TO_VIDEO: KieModel = {
    modelId: "bytedance/v1-pro-fast-image-to-video",
    modelName: "Bytedance V1 Pro Fast - Image to Video",
    provider: "Bytedance",
    category: "video",
    description: "Fast image-to-video generation with Bytedance V1 Pro",
    docUrl: "https://docs.kie.ai/market/bytedance/v1-pro-fast-image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "bytedance/v1-pro-fast-image-to-video", description: "Must be `bytedance/v1-pro-fast-image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt used to generate the video (Max length: 10000 characters)", example: "A cinematic close-up sequence of a single elegant ceramic coffee cup with saucer on a rustic wooden table near a sunlit window, hot rich espresso poured in a thin golden stream from above, gradually filling the cup in distinct stages: empty with faint steam, 1/4 filled with dark crema, half-filled with swirling coffee and rising steam, 3/4 filled nearing the rim, perfectly full just below overflow with glossy surface and soft bokeh highlights; ultra-realistic, warm golden-hour light, shallow depth of field, photorealism, detailed textures, subtle steam wisps, serene inviting atmosphere --ar 16:9 --q 2 --style raw" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "The URL of the image used to generate video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1762340693669m6sey187.webp" },
        { name: "resolution", type: "enum", required: false, default: "720p", options: ["720p", "1080p"], description: "Video resolution - 720p for balance, 1080p for higher quality", example: "720p" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "Duration of the video in seconds", example: "5" }
      ]
    },
    pricing: {
      credits: 3.2,
      kieUsd: 0.016,
      note: "per second. 720p: 3.2 cr ($0.016) for 5s, 3.6 cr ($0.018) for 10s; 1080p: 7.2 cr ($0.036) for 5s/10s."
    }
  };
  
  export const BYTEDANCE_V1_PRO_IMAGE_TO_VIDEO: KieModel = {
    modelId: "bytedance/v1-pro-image-to-video",
    modelName: "Bytedance V1 Pro - Image to Video",
    provider: "Bytedance",
    category: "video",
    description: "High-quality image-to-video generation with Bytedance V1 Pro",
    docUrl: "https://docs.kie.ai/market/bytedance/v1-pro-image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "bytedance/v1-pro-image-to-video", description: "Must be `bytedance/v1-pro-image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt used to generate the video (Max length: 10000 characters)", example: "A golden retriever dashing through shallow surf at the beach, back angle camera low near waterline, splashes frozen in time, blur trails in waves and paws, afternoon sun glinting off wet fur, overcast day, dramatic clouds" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "The URL of the image used to generate video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1755179021328w1nhip18.webp" },
        { name: "resolution", type: "enum", required: false, default: "720p", options: ["480p", "720p", "1080p"], description: "Video resolution - 480p for faster generation, 720p for balance, 1080p for higher quality", example: "720p" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "Duration of the video in seconds", example: "5" },
        { name: "camera_fixed", type: "boolean", required: false, description: "Whether to fix the camera position", example: false },
        { name: "seed", type: "number", required: false, default: -1, min: -1, max: 2147483647, step: 1, description: "Random seed to control video generation. Use -1 for random.", example: -1 },
        { name: "enable_safety_checker", type: "boolean", required: false, description: "Enable safety checker. Always enabled in Playground, can be disabled via API.", example: true }
      ]
    },
    pricing: {
      credits: 2.8,
      kieUsd: 0.014,
      note: "per second. 480p: 2.8 cr ($0.014); 720p: 6 cr ($0.03); 1080p: 14 cr ($0.07)."
    }
  };
  
  export const BYTEDANCE_V1_PRO_TEXT_TO_VIDEO: KieModel = {
    modelId: "bytedance/v1-pro-text-to-video",
    modelName: "Bytedance V1 Pro - Text to Video",
    provider: "Bytedance",
    category: "video",
    description: "High-quality text-to-video generation with Bytedance V1 Pro",
    docUrl: "https://docs.kie.ai/market/bytedance/v1-pro-text-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "bytedance/v1-pro-text-to-video", description: "Must be `bytedance/v1-pro-text-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt used to generate the video (Max length: 10000 characters)", example: "A boy with curly hair and a backpack rides a bike down a golden-lit rural road at sunset.\n[Cut to] He slows down and looks toward a field of tall grass.\n[Wide shot] His silhouette halts in the orange haze." },
        { name: "aspect_ratio", type: "enum", required: false, default: "16:9", options: ["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"], description: "The aspect ratio of the generated video", example: "16:9" },
        { name: "resolution", type: "enum", required: false, default: "720p", options: ["480p", "720p", "1080p"], description: "Video resolution - 480p for faster generation, 720p for balance, 1080p for higher quality", example: "720p" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "Duration of the video in seconds", example: "5" },
        { name: "camera_fixed", type: "boolean", required: false, description: "Whether to fix the camera position", example: false },
        { name: "seed", type: "number", required: false, default: -1, min: -1, max: 2147483647, step: 1, description: "Random seed to control video generation. Use -1 for random.", example: -1 },
        { name: "enable_safety_checker", type: "boolean", required: false, description: "Enable safety checker. Always enabled in Playground, can be disabled via API.", example: true }
      ]
    }
  };
  
  // =============================================================================
  // VIDEO MODELS - BYTEDANCE V1 LITE
  // =============================================================================
  
  export const BYTEDANCE_V1_LITE_IMAGE_TO_VIDEO: KieModel = {
    modelId: "bytedance/v1-lite-image-to-video",
    modelName: "Bytedance V1 Lite - Image to Video",
    provider: "Bytedance",
    category: "video",
    description: "Fast and efficient image-to-video generation with Bytedance V1 Lite",
    docUrl: "https://docs.kie.ai/market/bytedance/v1-lite-image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "bytedance/v1-lite-image-to-video", description: "Must be `bytedance/v1-lite-image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt used to generate the video (Max length: 10000 characters)", example: "Multiple shots. A traveler crosses an endless desert toward a glowing archway. [Cut to] His cloak whips in the wind as he reaches the massive stone threshold. [Wide shot] He steps through — and vanishes into a burst of light" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "The URL of the image used to generate video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17550783375205e9woshz.png" },
        { name: "resolution", type: "enum", required: false, default: "720p", options: ["480p", "720p", "1080p"], description: "Video resolution - 480p for faster generation, 720p for higher quality", example: "720p" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "Duration of the video in seconds", example: "5" },
        { name: "camera_fixed", type: "boolean", required: false, description: "Whether to fix the camera position", example: false },
        { name: "seed", type: "number", required: false, default: -1, min: -1, max: 2147483647, step: 1, description: "Random seed to control video generation. Use -1 for random.", example: -1 },
        { name: "enable_safety_checker", type: "boolean", required: false, description: "Enable safety checker. Always enabled in Playground, can be disabled via API.", example: true },
        { name: "end_image_url", type: "string", required: false, format: "uri", description: "The URL of the image the video ends with (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "" }
      ]
    }
  };
  
  export const BYTEDANCE_V1_LITE_TEXT_TO_VIDEO: KieModel = {
    modelId: "bytedance/v1-lite-text-to-video",
    modelName: "Bytedance V1 Lite - Text to Video",
    provider: "Bytedance",
    category: "video",
    description: "Fast and efficient text-to-video generation with Bytedance V1 Lite",
    docUrl: "https://docs.kie.ai/market/bytedance/v1-lite-text-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "bytedance/v1-lite-text-to-video", description: "Must be `bytedance/v1-lite-text-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt used to generate the video (Max length: 10000 characters)", example: "Wide-angle shot: A serene sailing boat gently sways in the harbor at dawn, surrounded by soft Impressionist hues of pink and orange with ivory accents. The camera slowly pans across the scene, capturing the delicate reflections on the water and the intricate details of the boat's sails as the light gradually brightens." },
        { name: "aspect_ratio", type: "enum", required: false, default: "16:9", options: ["16:9", "4:3", "1:1", "3:4", "9:16", "9:21"], description: "The aspect ratio of the generated video", example: "16:9" },
        { name: "resolution", type: "enum", required: false, default: "720p", options: ["480p", "720p", "1080p"], description: "Video resolution - 480p for faster generation, 720p for higher quality", example: "720p" },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "Duration of the video in seconds", example: "5" },
        { name: "camera_fixed", type: "boolean", required: false, description: "Whether to fix the camera position", example: false },
        { name: "seed", type: "integer", required: false, description: "Random seed to control video generation. Use -1 for random." },
        { name: "enable_safety_checker", type: "boolean", required: false, description: "Enable safety checker. Always enabled in Playground, can be disabled via API.", example: true }
      ]
    }
  };
  
  // =============================================================================
  // VIDEO MODELS - HAILUO 2.3 (MiniMax)
  // =============================================================================
  
  export const HAILUO_23_IMAGE_TO_VIDEO_PRO: KieModel = {
    modelId: "hailuo/2-3-image-to-video-pro",
    modelName: "Hailuo 2.3 - Image to Video Pro",
    provider: "MiniMax",
    category: "video",
    description: "Pro-quality image-to-video generation with Hailuo 2.3",
    docUrl: "https://docs.kie.ai/market/hailuo/2-3-image-to-video-pro",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "hailuo/2-3-image-to-video-pro", description: "Must be `hailuo/2-3-image-to-video-pro` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompt describing the desired video animation (Max length: 5000 characters)", example: "A graceful geisha performs a traditional Japanese dance indoors. She wears a luxurious red kimono with golden floral embroidery, white obi belt, and white tabi socks. Soft and elegant hand movements, expressive pose, sleeves flowing naturally. Scene set in a Japanese tatami room with warm ambient lighting, shoji paper sliding doors, and cherry blossom branches hanging in the foreground. Cinematic, soft depth of field, high detail fabric texture, hyper-realistic, smooth motion." },
        { name: "image_url", type: "string", required: true, format: "uri", description: "Input image to animate (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1761736831884xl56xfiw.webp" },
        { name: "duration", type: "enum", required: false, default: "6", options: ["6", "10"], description: "The duration of the video in seconds. 10 seconds videos are not supported for 1080p resolution.", example: "6" },
        { name: "resolution", type: "enum", required: false, default: "768P", options: ["768P", "1080P"], description: "The resolution of the generated video", example: "768P" }
      ]
    },
    pricing: { credits: 45, kieUsd: 0.225 }
  };
  
  export const HAILUO_23_IMAGE_TO_VIDEO_STANDARD: KieModel = {
    modelId: "hailuo/2-3-image-to-video-standard",
    modelName: "Hailuo 2.3 - Image to Video Standard",
    provider: "MiniMax",
    category: "video",
    description: "Standard-quality image-to-video generation with Hailuo 2.3",
    docUrl: "https://docs.kie.ai/market/hailuo/2-3-image-to-video-standard",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "hailuo/2-3-image-to-video-standard", description: "Must be `hailuo/2-3-image-to-video-standard` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompt describing the desired video animation (Max length: 5000 characters)", example: "Two armored medieval knights clash in an intense duel at sunset, cinematic lighting. Metal armor reflects warm golden light from the sun and the glowing swords. Sparks explode as the swords collide. Dynamic camera movement, shallow depth of field, dramatic slow motion. The scene takes place in an open desert battlefield, dust in the air, warm orange sun behind them, epic atmosphere. Highly detailed armor textures, realistic reflections, volumetric lighting, cinematic quality." },
        { name: "image_url", type: "string", required: true, format: "uri", description: "Input image to animate (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1761736401898mpm67du5.webp" },
        { name: "duration", type: "enum", required: false, default: "6", options: ["6", "10"], description: "The duration of the video in seconds. 10 seconds videos are not supported for 1080p resolution.", example: "6" },
        { name: "resolution", type: "enum", required: false, default: "768P", options: ["768P", "1080P"], description: "The resolution of the generated video", example: "768P" }
      ]
    },
    pricing: { credits: 30, kieUsd: 0.15, falUsd: 0.28, discount: -0.464 }
  };
  
  // =============================================================================
  // VIDEO MODELS - HAILUO 02 (MiniMax)
  // =============================================================================
  
  export const HAILUO_02_TEXT_TO_VIDEO_PRO: KieModel = {
    modelId: "hailuo/02-text-to-video-pro",
    modelName: "Hailuo 02 - Text to Video Pro",
    provider: "MiniMax",
    category: "video",
    description: "Pro-quality text-to-video generation with Hailuo 02",
    docUrl: "https://docs.kie.ai/market/hailuo/02-text-to-video-pro",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "hailuo/02-text-to-video-pro", description: "Must be `hailuo/02-text-to-video-pro` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 1500, description: "The text prompt for video generation (Max length: 1500 characters)", example: "High top angle wide mid close-up tracking shot, flying very fast two meters high over prehistoric ferns and moss-covered ground, dominated by a real young boy (pink t-shirt, pink shorts, white shoes, white long socks), with his back to the camera, body stretched out, gliding smoothly forward, flying in the air, casting a clear shadow on the terrain below. His legs and body are high above the surface, his feet not touching the ground, soaring in a Superman pose. The background is a vast Jurassic valley, filled with dense, ancient jungle vegetation and towering cycads." },
        { name: "prompt_optimizer", type: "boolean", required: false, description: "Whether to use the model's prompt optimizer", example: true }
      ]  },
    pricing: { credits: 57, kieUsd: 0.285, falUsd: 0.48, discount: -0.406 }
  };
  
  export const HAILUO_02_TEXT_TO_VIDEO_STANDARD: KieModel = {
    modelId: "hailuo/02-text-to-video-standard",
    modelName: "Hailuo 02 - Text to Video Standard",
    provider: "MiniMax",
    category: "video",
    description: "Standard-quality text-to-video generation with Hailuo 02",
    docUrl: "https://docs.kie.ai/market/hailuo/02-text-to-video-standard",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "hailuo/02-text-to-video-standard", description: "Must be `hailuo/02-text-to-video-standard` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 1500, description: "Text description for video generation (Max length: 1500 characters)", example: "A llama and a raccoon battle it out in an intense table tennis match, inside a roaring Olympic stadium. Slow-mo, wild angles, full comedy mode." },
        { name: "duration", type: "enum", required: false, default: "6", options: ["6", "10"], description: "The duration of the video in seconds. 10 seconds videos are not supported for 1080p resolution.", example: "6" },
        { name: "prompt_optimizer", type: "boolean", required: false, description: "Whether to use the model's prompt optimizer", example: true }
      ]  },
    pricing: { credits: 30, kieUsd: 0.15, falUsd: 0.27, discount: -0.444 }
  };
  
  export const HAILUO_02_IMAGE_TO_VIDEO_PRO: KieModel = {
    modelId: "hailuo/02-image-to-video-pro",
    modelName: "Hailuo 02 - Image to Video Pro",
    provider: "MiniMax",
    category: "video",
    description: "Pro-quality image-to-video generation with Hailuo 02",
    docUrl: "https://docs.kie.ai/market/hailuo/02-image-to-video-pro",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "hailuo/02-image-to-video-pro", description: "Must be `hailuo/02-image-to-video-pro` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 1500, description: "Text prompt describing the desired video animation (Max length: 1500 characters)", example: "Cinematic wide shot: A colossal starship drifts silently above the rings of Saturn, its metallic hull reflecting streaks of cosmic light. The camera pushes closer, revealing thousands of illuminated windows like a floating city. Smaller fighter crafts dart across the frame, leaving neon trails as they maneuver through the vastness of space. A sudden burst of thrusters scatters asteroid fragments in slow motion, glowing faintly as they collide and drift apart." },
        { name: "image_url", type: "string", required: true, format: "uri", description: "Input image to animate (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17585210783150ispzfo7.png" },
        { name: "end_image_url", type: "string", required: false, format: "uri", description: "Optional URL of the image to use as the last frame of the video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "" },
        { name: "prompt_optimizer", type: "boolean", required: false, description: "Whether to use the model's prompt optimizer", example: true }
      ]
    },
    pricing: { credits: 57, kieUsd: 0.285, falUsd: 0.48, discount: -0.406 }
  };
  
  export const HAILUO_02_IMAGE_TO_VIDEO_STANDARD: KieModel = {
    modelId: "hailuo/02-image-to-video-standard",
    modelName: "Hailuo 02 - Image to Video Standard",
    provider: "MiniMax",
    category: "video",
    description: "Standard-quality image-to-video generation with Hailuo 02",
    docUrl: "https://docs.kie.ai/market/hailuo/02-image-to-video-standard",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "hailuo/02-image-to-video-standard", description: "Must be `hailuo/02-image-to-video-standard` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 1500, description: "The text prompt describing the video to generate (Max length: 1500 characters)", example: "Epic aerial shot: A lone samurai stands atop a jagged mountain peak as a storm of sakura petals is swept across the wind. Behind him, the sky is split in two — half daylight, half night. The shot pulls back to reveal that the mountain is actually the curved back of a sleeping dragon that spans across the horizon. Lightning crackles in the distance as the dragon's eye slowly opens, glowing with ancient magic. The samurai doesn't flinch; he lowers his straw hat and places his hand on the hilt of his blade." },
        { name: "image_url", type: "string", required: true, format: "uri", description: "The URL of the image to use as the first frame of the video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17585207681646umf3lz8.png" },
        { name: "end_image_url", type: "string", required: false, format: "uri", description: "Optional URL of the image to use as the last frame of the video (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1758521423357w8586uq8.png" },
        { name: "duration", type: "enum", required: false, default: "10", options: ["6", "10"], description: "The duration of the video in seconds. 10 seconds videos are not supported for 1080p resolution.", example: "10" },
        { name: "resolution", type: "enum", required: false, default: "768P", options: ["512P", "768P"], description: "The resolution of the generated video", example: "768P" },
        { name: "prompt_optimizer", type: "boolean", required: false, description: "Whether to use the model's prompt optimizer", example: true }
      ]
    },
    pricing: { credits: 50, kieUsd: 0.25, falUsd: 0.45, discount: -0.444 }
  };
  
  // =============================================================================
  // VIDEO MODELS - SORA 2 (OpenAI)
  // =============================================================================
  
  export const SORA_2_IMAGE_TO_VIDEO: KieModel = {
    modelId: "sora-2-image-to-video",
    modelName: "Sora 2 - Image to Video",
    provider: "OpenAI",
    category: "video",
    description: "Generate videos from images using OpenAI Sora 2",
    docUrl: "https://docs.kie.ai/market/sora/2-image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "sora-2-image-to-video", description: "Must be `sora-2-image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt describing the desired video motion (Max length: 10000 characters)", example: "A claymation conductor passionately leads a claymation orchestra, while the entire group joyfully sings in chorus the phrase: \"Sora 2 is now available on Kie AI.\"" },
        { name: "image_urls", type: "array", required: true, max: 1, format: "uri", description: "URL of the image to use as the first frame. Must be publicly accessible (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: ["https://file.aiquickdraw.com/custom-page/akr/section-images/17594315607644506ltpf.jpg"] },
        { name: "aspect_ratio", type: "enum", required: false, default: "landscape", options: ["portrait", "landscape"], description: "The aspect ratio of the generated video", example: "landscape" },
        { name: "n_frames", type: "enum", required: false, default: "10", options: ["10", "15"], description: "The number of frames to be generated", example: "10" },
        { name: "remove_watermark", type: "boolean", required: false, description: "When enabled, removes watermarks from the generated video", example: true },
        { name: "character_id_list", type: "array", required: false, max: 5, description: "Optional array of character IDs from Sora-2-characters model to incorporate character animations. Maximum 5 character IDs allowed.", example: ["example_123456789", "example_987654321"] }
      ]
    },
    pricing: { credits: 30, kieUsd: 0.15, falUsd: 1.0, discount: -0.85 }
  };
  
  export const SORA_2_TEXT_TO_VIDEO: KieModel = {
    modelId: "sora-2-text-to-video",
    modelName: "Sora 2 - Text to Video",
    provider: "OpenAI",
    category: "video",
    description: "Generate videos from text prompts using OpenAI Sora 2",
    docUrl: "https://docs.kie.ai/market/sora/2-text-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "sora-2-text-to-video", description: "Must be `sora-2-text-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt describing the desired video motion (Max length: 10000 characters)", example: "A professor stands at the front of a lively classroom, enthusiastically giving a lecture. On the blackboard behind him are colorful chalk diagrams. With an animated gesture, he declares to the students: \"Sora 2 is now available on Kie AI, making it easier than ever to create stunning videos.\" The students listen attentively, some smiling and taking notes." },
        { name: "aspect_ratio", type: "enum", required: false, default: "landscape", options: ["portrait", "landscape"], description: "The aspect ratio of the generated video", example: "landscape" },
        { name: "n_frames", type: "enum", required: false, default: "10", options: ["10", "15"], description: "The number of frames to be generated", example: "10" },
        { name: "remove_watermark", type: "boolean", required: false, description: "When enabled, removes watermarks from the generated video", example: true },
        { name: "character_id_list", type: "array", required: false, max: 5, description: "Optional array of character IDs from Sora-2-characters model to incorporate character animations. Maximum 5 character IDs allowed.", example: ["example_123456789", "example_987654321"] }
      ]  },
    pricing: { credits: 30, kieUsd: 0.15, falUsd: 1.0, discount: -0.85 }
  };
  
  // =============================================================================
  // VIDEO MODELS - SORA 2 PRO (OpenAI)
  // =============================================================================
  
  export const SORA_2_PRO_IMAGE_TO_VIDEO: KieModel = {
    modelId: "sora-2-pro-image-to-video",
    modelName: "Sora 2 Pro - Image to Video",
    provider: "OpenAI",
    category: "video",
    description: "Pro-quality image-to-video generation using OpenAI Sora 2 Pro",
    docUrl: "https://docs.kie.ai/market/sora/2-pro-image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "sora-2-pro-image-to-video", description: "Must be `sora-2-pro-image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt describing the desired video motion (Max length: 10000 characters)", example: "" },
        { name: "image_urls", type: "array", required: true, max: 1, format: "uri", description: "URL of the image to use as the first frame. Must be publicly accessible (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: [] },
        { name: "aspect_ratio", type: "enum", required: false, default: "landscape", options: ["portrait", "landscape"], description: "The aspect ratio of the generated video", example: "landscape" },
        { name: "n_frames", type: "enum", required: false, default: "10", options: ["10", "15"], description: "The number of frames to be generated", example: "10" },
        { name: "size", type: "enum", required: false, default: "standard", options: ["standard", "high"], description: "The quality or size of the generated video", example: "standard" },
        { name: "remove_watermark", type: "boolean", required: false, description: "When enabled, removes watermarks from the generated video", example: true },
        { name: "character_id_list", type: "array", required: false, max: 5, description: "Optional array of character IDs from Sora-2-characters model to incorporate character animations. Maximum 5 character IDs allowed.", example: ["example_123456789", "example_987654321"] }
      ]
    },
    pricing: { credits: 150, kieUsd: 0.75, falUsd: 3.0, discount: -0.75 }
  };
  
  export const SORA_2_PRO_TEXT_TO_VIDEO: KieModel = {
    modelId: "sora-2-pro-text-to-video",
    modelName: "Sora 2 Pro - Text to Video",
    provider: "OpenAI",
    category: "video",
    description: "Pro-quality text-to-video generation using OpenAI Sora 2 Pro",
    docUrl: "https://docs.kie.ai/market/sora/2-pro-text-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "sora-2-pro-text-to-video", description: "Must be `sora-2-pro-text-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 10000, description: "The text prompt describing the desired video motion (Max length: 10000 characters)", example: "a happy dog running in the garden" },
        { name: "aspect_ratio", type: "enum", required: false, default: "landscape", options: ["portrait", "landscape"], description: "The aspect ratio of the generated video", example: "landscape" },
        { name: "n_frames", type: "enum", required: false, default: "10", options: ["10", "15"], description: "The number of frames to be generated", example: "10" },
        { name: "size", type: "enum", required: false, default: "high", options: ["standard", "high"], description: "The quality or size of the generated video", example: "high" },
        { name: "remove_watermark", type: "boolean", required: false, description: "When enabled, removes watermarks from the generated video", example: true },
        { name: "character_id_list", type: "array", required: false, max: 5, description: "Optional array of character IDs from Sora-2-characters model to incorporate character animations. Maximum 5 character IDs allowed.", example: ["example_123456789", "example_987654321"] }
      ]  },
    pricing: { credits: 150, kieUsd: 0.75, falUsd: 3.0, discount: -0.75 }
  };
  
  export const SORA_2_PRO_STORYBOARD: KieModel = {
    modelId: "sora-2-pro-storyboard",
    modelName: "Sora 2 Pro - Storyboard",
    provider: "OpenAI",
    category: "video",
    description: "Create multi-shot storyboard videos with Sora 2 Pro",
    docUrl: "https://docs.kie.ai/market/sora/2-pro-storyboard",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "sora-2-pro-storyboard", description: "Must be `sora-2-pro-storyboard` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "shots", type: "array", required: false, min: 1, max: 10, description: "Array of shot descriptions with durations. Total duration of all shots cannot exceed the selected n_frames value.", example: [{ "Scene": "A cute fluffy orange-and-white kitten wearing orange headphones, sitting at a cozy indoor table with a small slice of cake on a plate, a toy fish and a silver microphone nearby, warm soft lighting, cinematic close-up, shallow depth of field, gentle ASMR atmosphere.", "duration": 7.5 }, { "Scene": "The same cute fluffy orange-and-white kitten wearing orange headphones, in the same cozy indoor ASMR setup with the toy fish and microphone, the cake now finished, the kitten gently licks its lips with a satisfied smile, warm ambient lighting, cinematic close-up, shallow depth of field, calm and content mood.", "duration": 7.5 }] },
        { name: "n_frames", type: "enum", required: false, default: "15", options: ["10", "15", "25"], description: "Total length of the video", example: "15" },
        { name: "image_urls", type: "array", required: false, max: 1, format: "uri", description: "Upload an image file to use as input (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB). Limited to exactly 1 image.", example: ["https://file.aiquickdraw.com/custom-page/akr/section-images/1760776438785hyue5ogz.png"] },
        { name: "aspect_ratio", type: "enum", required: false, default: "landscape", options: ["portrait", "landscape"], description: "The aspect ratio of the generated video", example: "landscape" }
      ]
    },
    pricing: { credits: 150, kieUsd: 0.75 }
  };
  
  // =============================================================================
  // VIDEO MODELS - SORA UTILITIES (OpenAI)
  // =============================================================================
  
  export const SORA_WATERMARK_REMOVER: KieModel = {
    modelId: "sora-watermark-remover",
    modelName: "Sora - Watermark Remover",
    provider: "OpenAI",
    category: "video",
    description: "Remove watermarks from Sora 2 generated videos",
    docUrl: "https://docs.kie.ai/market/sora/watermark-remover",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "sora-watermark-remover", description: "Must be `sora-watermark-remover` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "video_url", type: "string", required: true, maxLength: 500, description: "Enter the Sora 2 video URL — it must be a publicly accessible link from OpenAI (starting with sora.chatgpt.com)", example: "https://sora.chatgpt.com/p/s_68e83bd7eee88191be79d2ba7158516f" }
      ]  },
    pricing: { credits: 10, kieUsd: 0.05 }
  };
  
  export const SORA_2_CHARACTERS: KieModel = {
    modelId: "sora-2-characters",
    modelName: "Sora 2 - Characters",
    provider: "OpenAI",
    category: "video",
    description: "Create character animations for use in Sora 2 video generation",
    docUrl: "https://docs.kie.ai/market/sora/2-characters",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "sora-2-characters", description: "Must be `sora-2-characters` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "character_file_url", type: "array", required: true, max: 1, format: "uri", description: "Array of character video URLs to use as input. Only one video URL is allowed. Duration must be 1-4 seconds. (Accepted: video/mp4, video/webm, video/avi; Max size: 10.0MB)", example: ["https://static.aiquickdraw.com/tools/example/character1.mp4"] },
        { name: "character_prompt", type: "string", required: false, maxLength: 5000, description: "Description of the character and desired animation style (Max length: 5000 characters)", example: "A friendly cartoon character with expressive eyes and fluid movements" },
        { name: "safety_instruction", type: "string", required: false, maxLength: 5000, description: "Safety guidelines and content restrictions for the animation (Max length: 5000 characters)", example: "Ensure the animation is family-friendly and contains no violent or inappropriate content" }
      ]
    }
  };
  
  // =============================================================================
  // VIDEO MODELS - WAN 2.6 (Alibaba)
  // =============================================================================
  
  export const WAN_26_IMAGE_TO_VIDEO: KieModel = {
    modelId: "wan/2-6-image-to-video",
    modelName: "Wan 2.6 - Image to Video",
    provider: "Alibaba",
    category: "video",
    description: "High-quality image-to-video generation with Wan 2.6",
    docUrl: "https://docs.kie.ai/market/wan/2-6-image-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "wan/2-6-image-to-video", description: "Must be `wan/2-6-image-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompts for video generation. Supports both Chinese and English, min 2 characters (Max length: 5000 characters)", example: "Anthopmopric fox singing a Christmas song at the rubbish dump in the rain." },
        { name: "image_urls", type: "array", required: true, max: 1, format: "uri", description: "Input image file (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB). All images must be at least 256x256px.", example: ["https://static.aiquickdraw.com/tools/example/1765957673717_awiBAidD.webp"] },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10", "15"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "resolution", type: "enum", required: false, default: "1080p", options: ["720p", "1080p"], description: "Video resolution tier", example: "1080p" }
      ]
    },
    pricing: { credits: 70, kieUsd: 0.35, falUsd: 0.5, discount: -0.3 }
  };
  
  export const WAN_26_TEXT_TO_VIDEO: KieModel = {
    modelId: "wan/2-6-text-to-video",
    modelName: "Wan 2.6 - Text to Video",
    provider: "Alibaba",
    category: "video",
    description: "High-quality text-to-video generation with Wan 2.6",
    docUrl: "https://docs.kie.ai/market/wan/2-6-text-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "wan/2-6-text-to-video", description: "Must be `wan/2-6-text-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompts for video generation. Supports both Chinese and English, min 1 character (Max length: 5000 characters)", example: "In a hyperrealistic ASMR video, a hand uses a knitted knife to slowly slice a burger made entirely of knitted wool. The satisfyingly crisp cut reveals a detailed cross-section of knitted meat, lettuce, and tomato slices. Captured in a close-up with a shallow depth of field, the scene is set against a stark, matte black surface. Cinematic lighting makes the surreal yarn textures shine with clear reflections. The focus is on the deliberate, satisfying motion and the unique, tactile materials." },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10", "15"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "resolution", type: "enum", required: false, default: "1080p", options: ["720p", "1080p"], description: "Video resolution tier", example: "1080p" }
      ]  },
    pricing: { credits: 70, kieUsd: 0.35, falUsd: 0.5, discount: -0.3 }
  };
  
  export const WAN_26_VIDEO_TO_VIDEO: KieModel = {
    modelId: "wan/2-6-video-to-video",
    modelName: "Wan 2.6 - Video to Video",
    provider: "Alibaba",
    category: "video",
    description: "Transform videos using Wan 2.6 with text guidance",
    docUrl: "https://docs.kie.ai/market/wan/2-6-video-to-video",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "wan/2-6-video-to-video", description: "Must be `wan/2-6-video-to-video` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "Text prompts for video generation. Supports both Chinese and English, min 2 characters (Max length: 5000 characters)", example: "The video drinks milk tea while doing some improvised dance moves to the music." },
        { name: "video_urls", type: "array", required: true, max: 3, format: "uri", description: "Input video URLs (Accepted: video/mp4, video/quicktime, video/x-matroska; Max size: 10.0MB)", example: ["https://static.aiquickdraw.com/tools/example/1765957777782_cNJpvhRx.mp4"] },
        { name: "duration", type: "enum", required: false, default: "5", options: ["5", "10"], description: "The duration of the generated video in seconds", example: "5" },
        { name: "resolution", type: "enum", required: false, default: "1080p", options: ["720p", "1080p"], description: "Video resolution tier", example: "1080p" }
      ]
    },
    pricing: { credits: 70, kieUsd: 0.35, falUsd: 0.5, discount: -0.3 }
  };
  
  // =============================================================================
  // VIDEO MODELS - WAN 2.2 TURBO (Alibaba)
  // =============================================================================
  
  export const WAN_22_A14B_IMAGE_TO_VIDEO_TURBO: KieModel = {
    modelId: "wan/2-2-a14b-image-to-video-turbo",
    modelName: "Wan 2.2 A14B Turbo - Image to Video",
    provider: "Alibaba",
    category: "video",
    description: "Fast image-to-video generation with Wan 2.2 A14B Turbo",
    docUrl: "https://docs.kie.ai/market/wan/2-2-a14b-image-to-video-turbo",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "wan/2-2-a14b-image-to-video-turbo", description: "Must be `wan/2-2-a14b-image-to-video-turbo` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the input image. If it doesn't match the chosen aspect ratio, it is resized and center cropped. (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1755166042585gtf2mlrk.png" },
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt to guide video generation (Max length: 5000 characters)", example: "Overcast lighting, medium lens, soft lighting, low contrast lighting, edge lighting, low angle shot, desaturated colors, medium close-up shot, clean single shot, cool colors, center composition.The camera captures a low-angle close-up of a Western man outdoors, sharply dressed in a black coat over a gray sweater, white shirt, and black tie." },
        { name: "resolution", type: "enum", required: false, default: "720p", options: ["480p", "720p"], description: "Resolution of the generated video", example: "720p" },
        { name: "enable_prompt_expansion", type: "boolean", required: false, description: "Whether to enable prompt expansion using a large language model", example: false },
        { name: "seed", type: "number", required: false, default: 0, min: 0, max: 2147483647, step: 1, description: "Random seed for reproducibility. If 0, a random seed is chosen.", example: 0 },
        { name: "acceleration", type: "enum", required: false, default: "none", options: ["none", "regular"], description: "Acceleration level. More acceleration = faster but lower quality. Recommended: 'none'", example: "none" }
      ]
    },
    pricing: { credits: 40, kieUsd: 0.2 }
  };
  
  export const WAN_22_A14B_TEXT_TO_VIDEO_TURBO: KieModel = {
    modelId: "wan/2-2-a14b-text-to-video-turbo",
    modelName: "Wan 2.2 A14B Turbo - Text to Video",
    provider: "Alibaba",
    category: "video",
    description: "Fast text-to-video generation with Wan 2.2 A14B Turbo",
    docUrl: "https://docs.kie.ai/market/wan/2-2-a14b-text-to-video-turbo",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "wan/2-2-a14b-text-to-video-turbo", description: "Must be `wan/2-2-a14b-text-to-video-turbo` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt to guide video generation (Max length: 5000 characters)", example: "Drone shot, fast traversal, starting inside a cracked, frosty circular pipe. The camera bursts upward through the pipe to reveal a vast polar landscape bathed in golden sunrise light. Workers in orange suits operate steaming machinery. The camera tilts up, revealing the scene from the perspective of a rising hot air balloon. It continues ascending into a glowing sky, the balloon trailing steam and displaying the letters \"KIE AI\" as it rises into breathtaking polar majesty." },
        { name: "resolution", type: "enum", required: false, default: "720p", options: ["480p", "720p"], description: "Resolution of the generated video", example: "720p" },
        { name: "aspect_ratio", type: "enum", required: false, default: "16:9", options: ["16:9", "9:16"], description: "Aspect ratio of the generated video", example: "16:9" },
        { name: "enable_prompt_expansion", type: "boolean", required: false, description: "Whether to enable prompt expansion using a large language model", example: false },
        { name: "seed", type: "number", required: false, default: 0, min: 0, max: 2147483647, step: 1, description: "Random seed for reproducibility. If 0, a random seed is chosen.", example: 0 },
        { name: "acceleration", type: "enum", required: false, default: "none", options: ["none", "regular"], description: "Acceleration level. More acceleration = faster but lower quality. Recommended: 'none'", example: "none" }
      ]  },
    pricing: { credits: 40, kieUsd: 0.2 }
  };
  
  // =============================================================================
  // VIDEO MODELS - WAN 2.2 ANIMATE (Alibaba)
  // =============================================================================
  
  export const WAN_22_ANIMATE_MOVE: KieModel = {
    modelId: "wan/2-2-animate-move",
    modelName: "Wan 2.2 - Animate Move",
    provider: "Alibaba",
    category: "video",
    description: "Animate images using motion from reference video",
    docUrl: "https://docs.kie.ai/market/wan/2-2-animate-move",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "wan/2-2-animate-move", description: "Must be `wan/2-2-animate-move` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "video_url", type: "string", required: true, format: "uri", description: "URL of the input video for motion reference (Accepted: video/mp4, video/quicktime, video/x-matroska; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17586254974931y2hottk.mp4" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the input image. If it doesn't match the chosen aspect ratio, it is resized and center cropped. (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1758625466310wpehpbnf.png" },
        { name: "resolution", type: "enum", required: false, default: "480p", options: ["480p", "580p", "720p"], description: "Resolution of the generated video", example: "480p" }
      ]
    },
    pricing: { credits: 6, kieUsd: 0.03, falUsd: 0.04, discount: -0.25 }
  };
  
  export const WAN_22_ANIMATE_REPLACE: KieModel = {
    modelId: "wan/2-2-animate-replace",
    modelName: "Wan 2.2 - Animate Replace",
    provider: "Alibaba",
    category: "video",
    description: "Replace subjects in video while preserving motion",
    docUrl: "https://docs.kie.ai/market/wan/2-2-animate-replace",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "wan/2-2-animate-replace", description: "Must be `wan/2-2-animate-replace` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "video_url", type: "string", required: true, format: "uri", description: "URL of the input video (Accepted: video/mp4, video/quicktime, video/x-matroska; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17586199429271xscyd5d.mp4" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the input image to replace subject. If it doesn't match the chosen aspect ratio, it is resized and center cropped. (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17586199255323tks43kq.png" },
        { name: "resolution", type: "enum", required: false, default: "480p", options: ["480p", "580p", "720p"], description: "Resolution of the generated video", example: "480p" }
      ]
    },
    pricing: { credits: 6, kieUsd: 0.03, falUsd: 0.04, discount: -0.25 }
  };
  
  // =============================================================================
  // VIDEO MODELS - WAN 2.2 SPEECH (Alibaba)
  // =============================================================================
  
  export const WAN_22_A14B_SPEECH_TO_VIDEO_TURBO: KieModel = {
    modelId: "wan/2-2-a14b-speech-to-video-turbo",
    modelName: "Wan 2.2 A14B Turbo - Speech to Video",
    provider: "Alibaba",
    category: "video",
    description: "Generate talking videos from image and audio with Wan 2.2",
    docUrl: "https://docs.kie.ai/market/wan/2-2-a14b-speech-to-video-turbo",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "wan/2-2-a14b-speech-to-video-turbo", description: "Must be `wan/2-2-a14b-speech-to-video-turbo` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt used for video generation (Max length: 5000 characters)", example: "The lady is talking" },
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the input image. If it doesn't match the chosen aspect ratio, it is resized and center cropped. (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1756797663082u4pjmcrq.png" },
        { name: "audio_url", type: "string", required: true, format: "uri", description: "The URL of the audio file (Accepted: audio/mp3, audio/wav, audio/ogg, audio/m4a, audio/flac, audio/aac, audio/x-ms-wma, audio/mpeg; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/17567977044127d1emlmc.mp3" },
        { name: "num_frames", type: "number", required: false, default: 80, min: 40, max: 120, step: 4, description: "Number of frames to generate (40-120, must be multiple of 4)", example: 80 },
        { name: "frames_per_second", type: "number", required: false, default: 16, min: 4, max: 60, step: 1, description: "Frames per second of the generated video (4-60)", example: 16 },
        { name: "resolution", type: "enum", required: false, default: "480p", options: ["480p", "580p", "720p"], description: "Resolution of the generated video", example: "480p" },
        { name: "negative_prompt", type: "string", required: false, maxLength: 500, description: "Negative prompt for video generation (Max length: 500 characters)", example: "" },
        { name: "seed", type: "integer", required: false, description: "Random seed for reproducibility. If None, a random seed is chosen." },
        { name: "num_inference_steps", type: "number", required: false, default: 27, min: 2, max: 40, step: 1, description: "Number of inference steps for sampling. Higher values give better quality but take longer.", example: 27 },
        { name: "guidance_scale", type: "number", required: false, default: 3.5, min: 1, max: 10, step: 0.1, description: "Classifier-free guidance scale. Higher values give better adherence to the prompt.", example: 3.5 },
        { name: "shift", type: "number", required: false, default: 5, min: 1, max: 10, step: 0.1, description: "Shift value for the video (1.0-10.0)", example: 5 },
        { name: "enable_safety_checker", type: "boolean", required: false, description: "If set to true, input data will be checked for safety before processing", example: true }
      ]
    },
    pricing: { credits: 12, kieUsd: 0.06, falUsd: 0.1, discount: -0.4 }
  };
  
  // =============================================================================
  // VIDEO MODELS - TOPAZ (Video Upscaling)
  // =============================================================================
  
  export const TOPAZ_VIDEO_UPSCALE: KieModel = {
    modelId: "topaz/video-upscale",
    modelName: "Topaz - Video Upscale",
    provider: "Topaz",
    category: "video",
    description: "Upscale videos using Topaz AI",
    docUrl: "https://docs.kie.ai/market/topaz/video-upscale",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "topaz/video-upscale", description: "Must be `topaz/video-upscale` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "video_url", type: "string", required: true, format: "uri", description: "URL of the video to upscale (Accepted: video/mp4, video/quicktime, video/x-matroska; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1758166466095hvbwkrpw.mp4" },
        { name: "upscale_factor", type: "enum", required: false, default: "2", options: ["1", "2", "4"], description: "Factor to upscale the video by (e.g. 2 doubles width and height)", example: "2" }
      ]
    },
    pricing: { credits: 12, kieUsd: 0.06, falUsd: 0.08, discount: -0.25 }
  };
  
  // =============================================================================
  // VIDEO MODELS - INFINITALK (Audio-driven Talking Videos)
  // =============================================================================
  
  export const INFINITALK_FROM_AUDIO: KieModel = {
    modelId: "infinitalk/from-audio",
    modelName: "Infinitalk - From Audio",
    provider: "Infinitalk",
    category: "video",
    description: "Generate talking videos from image and audio",
    docUrl: "https://docs.kie.ai/market/infinitalk/from-audio",
    endpoint: "https://api.kie.ai/api/v1/jobs/createTask",
    method: "POST",
    params: {
      model: { value: "infinitalk/from-audio", description: "Must be `infinitalk/from-audio` for this endpoint" },
      callBackUrl: { type: "string", format: "uri", required: false, description: "Callback URL for task completion updates", example: "https://your-domain.com/api/callback" },
      input: [
        { name: "image_url", type: "string", required: true, format: "uri", description: "URL of the input image. If it doesn't match the chosen aspect ratio, it is resized and center cropped. (Accepted: image/jpeg, image/png, image/webp; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1757329269873ggqj2hz3.png" },
        { name: "audio_url", type: "string", required: true, format: "uri", description: "The URL of the audio file (Accepted: audio/mpeg, audio/wav, audio/x-wav, audio/aac, audio/mp4, audio/ogg; Max size: 10.0MB)", example: "https://file.aiquickdraw.com/custom-page/akr/section-images/1757329255705mmqwrnri.mp3" },
        { name: "prompt", type: "string", required: true, maxLength: 5000, description: "The text prompt to guide video generation (Max length: 5000 characters)", example: "A young woman with long dark hair talking on a podcast." },
        { name: "resolution", type: "enum", required: false, default: "480p", options: ["480p", "720p"], description: "Resolution of the video to generate", example: "480p" },
        { name: "seed", type: "number", required: false, min: 10000, max: 1000000, description: "Random seed for reproducibility (valid range: 10000-1000000)" }
      ]
    },
    pricing: { credits: 3, kieUsd: 0.015, falUsd: 0.2, discount: -0.925 }
  };
  
  // =============================================================================
  // VIDEO MODEL REGISTRY
  // =============================================================================
  
  export const KIE_VIDEO_MODELS: Record<string, KieModel> = {
    // Grok Imagine (xAI)
    "grok-imagine/text-to-video": GROK_IMAGINE_TEXT_TO_VIDEO,
    "grok-imagine/image-to-video": GROK_IMAGINE_IMAGE_TO_VIDEO,
    // Kling 2.6 (Kuaishou)
    "kling-2.6/text-to-video": KLING_26_TEXT_TO_VIDEO,
    "kling-2.6/image-to-video": KLING_26_IMAGE_TO_VIDEO,
    "kling-2.6/motion-control": KLING_26_MOTION_CONTROL,
    // Kling V2.5 Turbo (Kuaishou)
    "kling/v2-5-turbo-image-to-video-pro": KLING_V25_TURBO_IMAGE_TO_VIDEO_PRO,
    "kling/v2-5-turbo-text-to-video-pro": KLING_V25_TURBO_TEXT_TO_VIDEO_PRO,
    // Kling AI Avatar (Kuaishou)
    "kling/ai-avatar-standard": KLING_AI_AVATAR_STANDARD,
    "kling/ai-avatar-pro": KLING_AI_AVATAR_PRO,
    // Kling V2.1 Master (Kuaishou)
    "kling/v2-1-master-image-to-video": KLING_V21_MASTER_IMAGE_TO_VIDEO,
    "kling/v2-1-master-text-to-video": KLING_V21_MASTER_TEXT_TO_VIDEO,
    // Kling V2.1 (Kuaishou)
    "kling/v2-1-pro": KLING_V21_PRO,
    "kling/v2-1-standard": KLING_V21_STANDARD,
    // Bytedance Seedance
    "bytedance/seedance-1.5-pro": BYTEDANCE_SEEDANCE_15_PRO,
    // Bytedance V1 Pro
    "bytedance/v1-pro-fast-image-to-video": BYTEDANCE_V1_PRO_FAST_IMAGE_TO_VIDEO,
    "bytedance/v1-pro-image-to-video": BYTEDANCE_V1_PRO_IMAGE_TO_VIDEO,
    "bytedance/v1-pro-text-to-video": BYTEDANCE_V1_PRO_TEXT_TO_VIDEO,
    // Bytedance V1 Lite
    "bytedance/v1-lite-image-to-video": BYTEDANCE_V1_LITE_IMAGE_TO_VIDEO,
    "bytedance/v1-lite-text-to-video": BYTEDANCE_V1_LITE_TEXT_TO_VIDEO,
    // Hailuo 2.3 (MiniMax)
    "hailuo/2-3-image-to-video-pro": HAILUO_23_IMAGE_TO_VIDEO_PRO,
    "hailuo/2-3-image-to-video-standard": HAILUO_23_IMAGE_TO_VIDEO_STANDARD,
    // Hailuo 02 (MiniMax)
    "hailuo/02-text-to-video-pro": HAILUO_02_TEXT_TO_VIDEO_PRO,
    "hailuo/02-text-to-video-standard": HAILUO_02_TEXT_TO_VIDEO_STANDARD,
    "hailuo/02-image-to-video-pro": HAILUO_02_IMAGE_TO_VIDEO_PRO,
    "hailuo/02-image-to-video-standard": HAILUO_02_IMAGE_TO_VIDEO_STANDARD,
    // Sora 2 (OpenAI)
    "sora-2-image-to-video": SORA_2_IMAGE_TO_VIDEO,
    "sora-2-text-to-video": SORA_2_TEXT_TO_VIDEO,
    // Sora 2 Pro (OpenAI)
    "sora-2-pro-image-to-video": SORA_2_PRO_IMAGE_TO_VIDEO,
    "sora-2-pro-text-to-video": SORA_2_PRO_TEXT_TO_VIDEO,
    "sora-2-pro-storyboard": SORA_2_PRO_STORYBOARD,
    // Sora Utilities (OpenAI)
    "sora-watermark-remover": SORA_WATERMARK_REMOVER,
    "sora-2-characters": SORA_2_CHARACTERS,
    // Wan 2.6 (Alibaba)
    "wan/2-6-image-to-video": WAN_26_IMAGE_TO_VIDEO,
    "wan/2-6-text-to-video": WAN_26_TEXT_TO_VIDEO,
    "wan/2-6-video-to-video": WAN_26_VIDEO_TO_VIDEO,
    // Wan 2.2 Turbo (Alibaba)
    "wan/2-2-a14b-image-to-video-turbo": WAN_22_A14B_IMAGE_TO_VIDEO_TURBO,
    "wan/2-2-a14b-text-to-video-turbo": WAN_22_A14B_TEXT_TO_VIDEO_TURBO,
    // Wan 2.2 Animate (Alibaba)
    "wan/2-2-animate-move": WAN_22_ANIMATE_MOVE,
    "wan/2-2-animate-replace": WAN_22_ANIMATE_REPLACE,
    // Wan 2.2 Speech (Alibaba)
    "wan/2-2-a14b-speech-to-video-turbo": WAN_22_A14B_SPEECH_TO_VIDEO_TURBO,
    // Topaz (Video Upscaling)
    "topaz/video-upscale": TOPAZ_VIDEO_UPSCALE,
    // Infinitalk (Audio-driven Talking Videos)
    "infinitalk/from-audio": INFINITALK_FROM_AUDIO,
  };
  