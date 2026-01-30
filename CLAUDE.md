# Obra CLI - Development Notes

## Project Overview

CLI tool for AI content generation (image, video, music) via Kie.ai API.

## Running the CLI

```bash
# Development
bun run bin/obra.ts [command]

# After linking globally
bun link
obra [command]

# Build standalone binary
bun run build
./dist/obra [command]
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
obra image generate "prompt" --model google/imagen4-fast --param aspect_ratio=16:9
obra image list [--flat] [--json]
obra image info <model>

# Video generation (default: grok-imagine/text-to-video)
obra video generate "prompt" --model grok-imagine/text-to-video
obra video generate "prompt" --image ./input.jpg  # Image-to-video
obra video list [--flat] [--json]
obra video info <model>

# Music generation (Suno API)
obra music generate "prompt" --model V4_5 [--instrumental] [--custom-mode]
obra music lyrics "prompt"                    # Generate lyrics only
obra music timestamps <taskId> <audioId>      # Get synced lyrics
obra music video <taskId> <audioId>           # Create music video
obra music list
obra music info <model>
```

### Task Management

```bash
obra status <taskId> [--wait] [--json]
obra download <taskId> [--output <dir>]
```

### History

```bash
obra history list [-l <n>] [-t <type>] [-s <status>] [--json]
obra history show <ref>    # ref = row number or task ID
obra history clear [--yes]
obra history path
```

### Configuration

```bash
obra config set kie.apiKey <key>     # Required: set API key
obra config get <key> [--unmask]
obra config list [--unmask] [--json]
obra config delete <key>
obra config path                      # Shows: ~/.config/obra/config.json
obra config reset [--yes]
```

### Providers

```bash
obra provider list [--json]
obra provider use <name>
obra provider info <name>
```

## Configuration

**Location:** `~/.config/obra/config.json`

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
│   ├── history.ts        # Generation history commands
│   └── params.ts         # Parameter parsing utilities
├── core/
│   ├── config.ts         # Configuration management
│   ├── history.ts        # History storage & querying
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

Two methods (merged with precedence: JSON > pairs):
```bash
--param key=value                      # Generic parameters (repeatable)
--params-json '{"key":"value"}'        # JSON parameters
```

### Provider Architecture

Extensible via `BaseProvider` abstract class. Currently only Kie.ai implemented.

### Polling

Default: 2s interval, exponential backoff (max 10s), 10 minute timeout.

### Output Modes

All commands support `--json` for machine-readable output and `--wait` to poll until completion.

## Publishing

**Never publish manually.** Publishing is handled automatically by GitHub Actions when a version tag is pushed.

To release a new version:

1. Update `version` in `package.json`
2. Update `.version()` in `src/index.ts` to match
3. Commit the changes
4. Create and push a git tag: `git tag v<version> && git push origin v<version>`
5. GitHub Actions will build, test, and publish to npm automatically
