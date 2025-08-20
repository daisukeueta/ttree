# ttree

A command-line tool that displays directory structures in tree format with token counting and AI cost estimation for each file and directory. Perfect for analyzing codebases, understanding token usage, and estimating AI API costs before sending code to language models.

## Features

- 🌳 **Tree Structure Display**: Visualize directory hierarchy in a clean tree format
- 🔢 **Token Counting**: Calculate and display token counts for individual files and directories
- 💰 **AI Cost Estimation**: Always-on cost estimates for popular AI models (Claude, GPT, Gemini)
- 🎨 **Color-coded Output**: Different colors for files, directories, and token counts based on size
- 🚫 **Smart Filtering**: Automatic .gitignore support plus custom ignore patterns
- 📊 **Multiple Output Formats**: Human-readable tree view or JSON output
- ⚡ **Performance Optimized**: Efficient traversal with configurable depth limits
- 🔧 **Flexible Options**: Sort by name, size, or tokens with threshold filtering

## Installation

### From Source

```bash
# Clone the repository
git clone <repository-url>
cd ttree

# Install dependencies
npm install

# Build the project
npm run build

# Install globally (optional)
npm install -g .
```

### Development Mode

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev [options] [path]
```

## Usage

### Basic Usage

```bash
# Analyze current directory
ttree

# Analyze specific directory
ttree src/

# Development mode
npm run dev
npm run dev src/
```

### Command Line Options

```bash
ttree [options] [path]

Arguments:
  path                       Directory path to analyze (default: ".")

Options:
  -V, --version              output the version number
  -d, --max-depth <number>   Maximum depth to traverse
  -i, --ignore <patterns>    Ignore patterns (comma-separated)
  --include <patterns>       Include patterns (comma-separated)
  -e, --encoding <encoding>  Token encoding: o200k_base (GPT-4o, default), 
                             cl100k_base (GPT-3.5/4), or model names
  -j, --json                 Output in JSON format
  --no-files                 Show directories only
  -s, --sort <type>          Sort by: name, size, tokens (default: "name")
  -t, --threshold <number>   Minimum tokens to display
  --cost                     Show cost estimates (deprecated - always shown)
  --models <models>          Models to show costs for (comma-separated)
  --output-ratio <ratio>     Output token ratio for cost estimation (default: 0.5)
  -h, --help                 display help for command
```

## Examples

### Basic Examples

```bash
# Show current directory with default settings and cost estimates
ttree

# Analyze src directory with depth limit
ttree src/ -d 2

# Show only directories (no individual files)
ttree --no-files

# Sort by token count (descending)
ttree -s tokens

# Use GPT-3.5/GPT-4 tokenizer instead of default GPT-4o
ttree -e cl100k_base
```

### Advanced Filtering & Cost Options

```bash
# Ignore specific patterns
ttree -i "*.log,*.tmp,test/**"

# Show only files with 100+ tokens
ttree -t 100

# Include only TypeScript files
ttree --include "**/*.ts,**/*.tsx"

# Show costs for specific models only
ttree --models "claude-haiku-3.5,gpt-4o-mini"

# Adjust output ratio for cost calculation (default: 0.5)
ttree --output-ratio 0.3

# Combine multiple options
ttree src/ -d 3 -s tokens -t 50 --no-files --models "claude-sonnet-4"
```

### Output Formats

```bash
# Human-readable tree (default)
ttree

# JSON output for programmatic use
ttree -j

# JSON output with specific directory
ttree src/ -j
```

## Sample Output

### Tree Format (Default)

```
src/
├── cli.ts (501 tokens)
├── constants.ts (404 tokens)
├── cost-calculator.ts (528 tokens)
├── cost-formatter.ts (918 tokens)
├── file-traverser.ts (587 tokens)
├── formatters.ts (477 tokens)
├── gitignore-parser.ts (726 tokens)
├── index.ts (494 tokens)
├── pricing-data.ts (582 tokens)
├── token-counter.ts (683 tokens)
├── tree-builder.ts (1.0k tokens)
├── tree-renderer.ts (800 tokens)
├── types.ts (369 tokens)
└── utils.ts (634 tokens)

Total: 8,743 tokens
Files: 14, Directories: 1

💰 Cost Estimates (Input + Output @ 0.5x ratio):
┌─────────────────┬─────────┬─────────┬───────────┐
│ Model           │ Input   │ Output  │ Total     │
├─────────────────┼─────────┼─────────┼───────────┤
│ Claude Sonnet 4 │  $0.026 │  $0.065 │    $0.092 │
│ Claude Opus 4.1 │  $0.131 │  $0.327 │    $0.458 │
└─────────────────┴─────────┴─────────┴───────────┘
```

### JSON Format

```json
{
  "tree": {
    "name": "src",
    "path": "/path/to/src",
    "type": "directory",
    "tokens": 8932,
    "children": [
      {
        "name": "components",
        "path": "/path/to/src/components",
        "type": "directory",
        "tokens": 2345,
        "children": [...]
      }
    ]
  },
  "stats": {
    "totalFiles": 6,
    "totalDirectories": 3,
    "totalTokens": 8932,
    "processedFiles": 6,
    "skippedFiles": 0
  }
}
```

## Configuration

### .gitignore Support

ttree automatically respects `.gitignore` files in the target directory. Common patterns like `node_modules/`, `dist/`, and `*.log` are automatically excluded.

### Default Ignore Patterns

The following patterns are ignored by default:

- `node_modules/**`
- `.git/**`
- `dist/**`
- `build/**`
- `.next/**`
- `.vscode/**`
- `.idea/**`
- `*.log`
- `.DS_Store`
- `Thumbs.db`

### Token Encoding

ttree uses OpenAI's `o200k_base` encoding (GPT-4o) by default for accurate token counting with the latest models. You can specify a different encoding with the `-e` option:

- `o200k_base` - GPT-4o (default)
- `cl100k_base` - GPT-3.5/GPT-4 legacy models

### AI Cost Estimation

Cost estimates are shown by default for all analyses, displaying:
- **Input costs** - Based on your actual token count
- **Output costs** - Estimated at 50% of input tokens (adjustable with `--output-ratio`)
- **Total costs** - Combined input + output costs in USD

**Default models shown:**
- Claude Sonnet 4 ($3/$15 per million tokens)
- Claude Opus 4.1 ($15/$75 per million tokens)

**All supported models:**
- Claude Haiku 3.5, Sonnet 4, Opus 4.1
- GPT-4o, GPT-4o Mini, GPT-4 Turbo  
- Gemini 1.5 Pro

### File Type Detection

- **Text files**: Analyzed for token counting
- **Binary files**: Counted as 0 tokens
- **Large files**: Files over 50MB are skipped for performance

## Color Coding

- 🔵 **Blue**: Directory names
- 🟢 **Green**: Low token count (< 100)
- 🟡 **Yellow**: Medium token count (100-999)
- 🔴 **Red**: High token count (≥ 1000)
- 🔘 **Gray**: Zero tokens or tree structure

## Development

### Scripts

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

### Project Structure

```
ttree/
├── src/
│   ├── cli.ts              # Command-line interface
│   ├── constants.ts        # Configuration constants
│   ├── cost-calculator.ts  # AI model cost calculation logic
│   ├── cost-formatter.ts   # Cost display and table formatting
│   ├── file-traverser.ts   # Directory traversal logic
│   ├── formatters.ts       # Output formatting utilities
│   ├── gitignore-parser.ts # .gitignore pattern matching
│   ├── index.ts           # Main entry point
│   ├── pricing-data.ts     # AI model pricing database
│   ├── token-counter.ts   # Token counting logic
│   ├── tree-builder.ts    # Tree structure building
│   ├── tree-renderer.ts   # Output rendering
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
├── package.json
├── tsconfig.json
└── README.md
```

## Technical Details

### Cost Calculation System

The cost estimation feature uses up-to-date pricing data for major AI providers:

**Cost Components:**
- **Input tokens**: Exact count from your files using the selected tokenizer
- **Output tokens**: Estimated as a percentage of input tokens (default: 50%, adjustable with `--output-ratio`)
- **Total cost**: Input cost + output cost in USD

**Pricing Updates:**
- Pricing data is maintained in `src/pricing-data.ts`
- Costs are calculated per million tokens as per each provider's official pricing
- Default models (Claude Sonnet 4, Claude Opus 4.1) are chosen for balanced cost/performance

**Output Ratio Logic:**
- Default 0.5 ratio assumes output will be 50% of input size
- Adjust based on your use case: 0.1 for summaries, 1.0+ for code generation
- Ratio affects only the cost estimation, not token counting

## Performance Considerations

- **Large directories**: Use `-d` to limit traversal depth
- **Many files**: Use `-t` to filter by token threshold
- **Binary files**: Automatically skipped to improve performance
- **Memory usage**: Large files (>50MB) are excluded from analysis

## Use Cases

- **AI Development**: Analyze token usage and estimate costs before sending to language models
- **Cost Planning**: Calculate potential AI API costs for different models and providers
- **Code Review**: Understand codebase structure, file sizes, and processing costs
- **Documentation**: Generate project overviews with token metrics and cost breakdowns
- **Optimization**: Identify large files that may need refactoring to reduce AI processing costs
- **Model Selection**: Compare costs across different AI models to choose the most cost-effective option

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [tiktoken](https://github.com/openai/tiktoken) for accurate token counting
- Inspired by the classic `tree` command with modern AI workflow needs
- Uses [commander.js](https://github.com/tj/commander.js) for CLI interface