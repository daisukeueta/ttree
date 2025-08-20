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
npx ttree
```

Or install globally:

```bash
npm install -g ttree
```

## Usage

### Basic Usage

```bash
# Analyze current directory
ttree

# Analyze specific directory
ttree src/
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

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [tiktoken](https://github.com/openai/tiktoken) for accurate token counting
- Inspired by the classic `tree` command with modern AI workflow needs
- Uses [commander.js](https://github.com/tj/commander.js) for CLI interface
