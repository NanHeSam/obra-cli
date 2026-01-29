# obra - Multi-Provider Creative AI CLI

A command-line tool for generating images, videos, and music using AI providers like Kie.ai.

## Installation

```bash
npm install -g obra
```

### Set Up Your API Key

Get your API key from [Kie.ai](https://kie.ai) and configure it:

```bash
obra config set kie.apiKey YOUR_API_KEY
```

Verify it's set:

```bash
obra config list
```

Your config is stored at `~/.config/obra/config.json` (or run `obra config path` to see the exact location).

## Generating Content

### Basic Usage

All generation commands follow the same pattern:

```bash
obra <type> generate "<prompt>" [options]
```

Without `--wait`, the command returns immediately with a task ID. With `--wait`, it polls until complete and shows the result URL.

### Image Generation

```bash
# Start a task (returns task ID immediately)
obra image generate "a red panda eating bamboo"

# Wait for completion and get the result URL
obra image generate "a red panda eating bamboo" --wait

# With options
obra image generate "cyberpunk cityscape" \
  --model flux-2 \
  --aspect-ratio 16:9 \
  --style cinematic \
  --wait
```

### Video Generation

```bash
obra video generate "ocean waves crashing on rocks" \
  --duration 5 \
  --aspect-ratio 16:9 \
  --wait

# Image-to-video (animate a reference image)
obra video generate "make it come alive" \
  --image ./my-photo.png \
  --wait
```

### Music Generation

```bash
# With vocals
obra music generate "upbeat pop song about summer" --wait

# Instrumental only
obra music generate "lo-fi hip hop beats" --instrumental --wait

# With custom lyrics
obra music generate "acoustic ballad" \
  --lyrics "Here are my custom lyrics..." \
  --wait
```

## Finding Your Generated Assets

**Note:** The `generate` command does **not** automatically download files. It returns a URL where your content is hosted. Use `obra download` to save files locally.

### Step 1: Generate and Get the URL

When you add `--wait`, the CLI waits for completion and displays the result URL:

```bash
$ obra image generate "a mountain sunset" --wait

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
obra download abc123

# Download to specific directory
obra download abc123 --output ./my-images/
```

The file will be saved as `abc123_1.png` (or similar based on content type).

### If You Didn't Use `--wait`

Check the task status later using the task ID:

```bash
# Check current status
obra status abc123

# Wait for completion and show URL
obra status abc123 --wait

# Then download
obra download abc123
```

### Method 4: JSON Output

For scripting, use `--json` to get machine-readable output:

```bash
obra image generate "a cat" --wait --json
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
obra image list

# Get details about a specific model
obra image info flux-2

# Same for other types
obra video list
obra music list
```

## Configuration

### View Configuration

```bash
obra config list              # Show all settings
obra config path              # Show config file location
obra config get kie.apiKey    # Get a specific value (masked)
```

### Modify Configuration

```bash
# Set API key
obra config set kie.apiKey YOUR_API_KEY

# Change default image model
obra config set defaults.image.model gpt-image-1.5

# Change default aspect ratio
obra config set defaults.image.aspectRatio 16:9

# Reset everything to defaults
obra config reset -y
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
obra provider list

# Show provider details
obra provider info kie

# Switch default provider (for future multi-provider support)
obra provider use kie
```

## Command Reference

| Command | Description |
|---------|-------------|
| `obra image generate <prompt>` | Generate an image |
| `obra video generate <prompt>` | Generate a video |
| `obra music generate <prompt>` | Generate music |
| `obra music lyrics <prompt>` | Generate lyrics only |
| `obra status <id>` | Check task status |
| `obra download <id>` | Download task outputs |
| `obra config <subcommand>` | Manage configuration |
| `obra provider <subcommand>` | Manage providers |

### Common Options

| Option | Description |
|--------|-------------|
| `-w, --wait` | Wait for task completion |
| `-o, --output <path>` | Output file/directory |
| `-m, --model <name>` | Model to use |
| `-p, --provider <name>` | Provider to use |
| `--json` | Output as JSON |
| `-h, --help` | Show help |

## Development

```bash
# Install dependencies
bun install

# Run in development mode
bun run bin/obra.ts [command]

# Build (compiles TypeScript to JavaScript)
npm run build

# Build standalone binary (requires Bun)
npm run build:binary

# Run tests
bun test

# Run tests in watch mode
bun test --watch
```

## License

MIT
