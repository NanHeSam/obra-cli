# kai - Multi-Provider Creative AI CLI

A command-line tool for generating images, videos, and music using AI providers like Kie.ai.

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Your API Key

Get your API key from [Kie.ai](https://kie.ai) and configure it:

```bash
bun run bin/kai.ts config set kie.apiKey YOUR_API_KEY
```

Verify it's set:

```bash
bun run bin/kai.ts config list
```

Your config is stored at `~/.config/kai/config.json` (or run `kai config path` to see the exact location).

### 3. Run the CLI

```bash
# During development
bun run bin/kai.ts [command]

# Or link it globally for convenience
bun link
kai [command]
```

## Generating Content

### Basic Usage

All generation commands follow the same pattern:

```bash
kai <type> generate "<prompt>" [options]
```

Without `--wait`, the command returns immediately with a task ID. With `--wait`, it polls until complete and shows the result URL.

### Image Generation

```bash
# Start a task (returns task ID immediately)
kai image generate "a red panda eating bamboo"

# Wait for completion and get the result URL
kai image generate "a red panda eating bamboo" --wait

# With options
kai image generate "cyberpunk cityscape" \
  --model flux-2 \
  --aspect-ratio 16:9 \
  --style cinematic \
  --wait
```

### Video Generation

```bash
kai video generate "ocean waves crashing on rocks" \
  --duration 5 \
  --aspect-ratio 16:9 \
  --wait

# Image-to-video (animate a reference image)
kai video generate "make it come alive" \
  --image ./my-photo.png \
  --wait
```

### Music Generation

```bash
# With vocals
kai music generate "upbeat pop song about summer" --wait

# Instrumental only
kai music generate "lo-fi hip hop beats" --instrumental --wait

# With custom lyrics
kai music generate "acoustic ballad" \
  --lyrics "Here are my custom lyrics..." \
  --wait
```

## Finding Your Generated Assets

**Note:** The `generate` command does **not** automatically download files. It returns a URL where your content is hosted. Use `kai download` to save files locally.

### Step 1: Generate and Get the URL

When you add `--wait`, the CLI waits for completion and displays the result URL:

```bash
$ kai image generate "a mountain sunset" --wait

✓ Task created: abc123
⠋ Generating image... 100%

Task Result:
  ID: abc123
  Status: success

Outputs:
  • https://cdn.kie.ai/outputs/abc123/image.png
```

You can open this URL directly in your browser, or continue to step 2 to download.

### Step 2: Download to Your Computer

Use the task ID to download the file:

```bash
# Download to current directory
kai download abc123

# Download to specific directory
kai download abc123 --output ./my-images/
```

The file will be saved as `abc123_1.png` (or similar based on content type).

### If You Didn't Use `--wait`

Check the task status later using the task ID:

```bash
# Check current status
kai status abc123

# Wait for completion and show URL
kai status abc123 --wait

# Then download
kai download abc123
```

### Method 4: JSON Output

For scripting, use `--json` to get machine-readable output:

```bash
kai image generate "a cat" --wait --json
```

Output:
```json
{
  "id": "abc123",
  "status": "success",
  "outputs": [
    {
      "url": "https://cdn.kie.ai/outputs/abc123/image.png",
      "type": "image"
    }
  ]
}
```

## Checking Available Models

```bash
# List all image models
kai image list

# Get details about a specific model
kai image info flux-2

# Same for other types
kai video list
kai music list
```

## Configuration

### View Configuration

```bash
kai config list              # Show all settings
kai config path              # Show config file location
kai config get kie.apiKey    # Get a specific value (masked)
```

### Modify Configuration

```bash
# Set API key
kai config set kie.apiKey YOUR_API_KEY

# Change default image model
kai config set defaults.image.model gpt-image-1.5

# Change default aspect ratio
kai config set defaults.image.aspectRatio 16:9

# Reset everything to defaults
kai config reset -y
```

### Default Settings

The CLI comes with sensible defaults:

| Type  | Default Model   | Other Defaults        |
|-------|-----------------|----------------------|
| Image | flux-2          | aspect-ratio: 1:1    |
| Video | runway          | duration: 5s         |
| Music | suno            | duration: 60s        |

## Provider Management

```bash
# List available providers
kai provider list

# Show provider details
kai provider info kie

# Switch default provider (for future multi-provider support)
kai provider use kie
```

## Command Reference

| Command | Description |
|---------|-------------|
| `kai image generate <prompt>` | Generate an image |
| `kai video generate <prompt>` | Generate a video |
| `kai music generate <prompt>` | Generate music |
| `kai music lyrics <prompt>` | Generate lyrics only |
| `kai status <id>` | Check task status |
| `kai download <id>` | Download task outputs |
| `kai config <subcommand>` | Manage configuration |
| `kai provider <subcommand>` | Manage providers |

### Common Options

| Option | Description |
|--------|-------------|
| `-w, --wait` | Wait for task completion |
| `-o, --output <path>` | Output file/directory |
| `-m, --model <name>` | Model to use |
| `-p, --provider <name>` | Provider to use |
| `--json` | Output as JSON |
| `-h, --help` | Show help |

## Building a Standalone Binary

```bash
bun run build
./dist/kai --help
```

This creates a single executable that doesn't require Bun to be installed.

## Development

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch
```

## License

MIT
