# Kai CLI - Development Notes

## Project Overview

CLI tool for AI content generation (image, video, music) via Kie.ai API.

## Running the CLI

```bash
# Development
bun run bin/kai.ts [command]

# After linking globally
bun link
kai [command]

# Build standalone binary
bun run build
./dist/kai [command]
```

## Testing

```bash
bun test
bun test --watch
```

## Commands Reference

### Generation Commands

```bash
# Image generation
kai image generate "prompt" --model google/imagen4-fast --aspect-ratio 16:9
kai image list [--flat] [--json]
kai image info <model>

# Video generation (default: grok-imagine/text-to-video)
kai video generate "prompt" --model grok-imagine/text-to-video
kai video generate "prompt" --image ./input.jpg  # Image-to-video
kai video list [--flat] [--json]
kai video info <model>

# Music generation (Suno API)
kai music generate "prompt" --model V4_5 [--instrumental] [--custom-mode]
kai music lyrics "prompt"                    # Generate lyrics only
kai music timestamps <taskId> <audioId>      # Get synced lyrics
kai music video <taskId> <audioId>           # Create music video
kai music list
kai music info <model>
```

### Task Management

```bash
kai status <taskId> [--wait] [--json]
kai download <taskId> [--output <dir>]
```

### Configuration

```bash
kai config set kie.apiKey <key>     # Required: set API key
kai config get <key> [--unmask]
kai config list [--unmask] [--json]
kai config delete <key>
kai config path                      # Shows: ~/.config/kai/config.json
kai config reset [--yes]
```

### Providers

```bash
kai provider list [--json]
kai provider use <name>
kai provider info <name>
```

## Configuration

**Location:** `~/.config/kai/config.json`

**Key config paths:**
- `providers.kie.apiKey` - API key (shorthand: `kie.apiKey`)
- `defaults.image.model` - Default image model
- `defaults.video.model` - Default video model
- `defaults.music.model` - Default music model (V3_5, V4, V4_5, V4_5PLUS, V4_5ALL, V5)

## Kie.ai API

### Endpoints

- **Base URL:** `https://api.kie.ai`
- **Create Task:** `POST /api/v1/jobs/createTask`
- **Get Status:** `GET /api/v1/jobs/recordInfo?taskId=<id>`
- **Music (Suno):** `/api/v1/generate`, `/api/v1/lyrics`, `/api/v1/mp4/generate`

### Authentication

```
Authorization: Bearer <API_KEY>
```

### Response Format

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "abc123",
    "state": "success",
    "resultJson": "{\"resultUrls\":[\"https://...\"]}",
    "failMsg": null,
    "costTime": 10
  }
}
```

**State values:** `waiting`, `queuing`, `generating`, `success`, `fail`

**Output URLs:** Parse `resultJson` as JSON, then access `resultUrls` array.

### Model Naming

Model IDs follow `provider/model-variant` pattern:
- Image: `google/imagen4`, `flux-2/*`, `ideogram/*`, `z-image`
- Video: `grok-imagine/*`, `kling/*`, `hailuo/*`, `wan/*`, `sora-2-*`, `veo-3-1`
- Music: Suno models (V3_5 through V5)

## Project Structure

```
src/
├── index.ts              # CLI setup (Commander)
├── commands/             # Command implementations
│   ├── image.ts
│   ├── video.ts
│   ├── music.ts
│   ├── status.ts
│   ├── download.ts
│   ├── config.ts
│   ├── provider.ts
│   └── params.ts         # Parameter parsing utilities
├── core/
│   ├── config.ts         # Configuration management
│   ├── types.ts          # Core domain types
│   ├── output.ts         # Formatted output helpers
│   └── download.ts       # File download utilities
├── providers/
│   ├── interface.ts      # Provider base class
│   ├── registry.ts       # Provider registry
│   └── kie/
│       ├── index.ts      # Kie provider implementation
│       ├── client.ts     # API client
│       ├── interface.ts  # Kie-specific types
│       ├── output.ts     # Output formatting
│       ├── image-models.ts
│       ├── video-models.ts
│       ├── static-models.ts    # Music models
│       ├── model-registry.ts
│       └── model-validation.ts
└── utils/
    └── polling.ts        # Task polling with backoff
```

## Key Patterns

### Parameter Passing

Three methods (merged with precedence: flags > JSON > pairs):
```bash
--aspect-ratio 16:9                    # Option flags
--param key=value                      # Generic parameters (repeatable)
--params-json '{"key":"value"}'        # JSON parameters
```

### Provider Architecture

Extensible via `BaseProvider` abstract class. Currently only Kie.ai implemented.

### Polling

Default: 2s interval, exponential backoff (max 10s), 10 minute timeout.

### Output Modes

All commands support `--json` for machine-readable output and `--wait` to poll until completion.
