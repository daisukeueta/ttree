# ttree

A command-line tool that displays directory structures in tree format with token counting for each file and directory. Perfect for analyzing codebases and understanding token usage for AI applications.

## Features

- 🌳 **Tree Structure Display**: Visualize directory hierarchy in a clean tree format
- 🔢 **Token Counting**: Calculate and display token counts for individual files and directories
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
  -e, --encoding <encoding>  Token encoding to use (default: "cl100k_base")
  -j, --json                 Output in JSON format
  --no-files                 Show directories only
  -s, --sort <type>          Sort by: name, size, tokens (default: "name")
  -t, --threshold <number>   Minimum tokens to display
  -h, --help                 display help for command
```

## Examples

### Basic Examples

```bash
# Show current directory with default settings
ttree

# Analyze src directory with depth limit
ttree src/ -d 2

# Show only directories (no individual files)
ttree --no-files

# Sort by token count (descending)
ttree -s tokens
```

### Advanced Filtering

```bash
# Ignore specific patterns
ttree -i "*.log,*.tmp,test/**"

# Show only files with 100+ tokens
ttree -t 100

# Include only TypeScript files
ttree --include "**/*.ts,**/*.tsx"

# Combine multiple options
ttree src/ -d 3 -s tokens -t 50 --no-files
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
├── components/ (2.3k tokens)
│   ├── Button.tsx (456 tokens)
│   ├── Modal.tsx (892 tokens)
│   └── Form.tsx (1.1k tokens)
├── utils/ (1.8k tokens)
│   ├── helpers.ts (723 tokens)
│   └── constants.ts (1.1k tokens)
├── index.ts (234 tokens)
└── types.ts (156 tokens)

Total: 8,932 tokens
Files: 6, Directories: 3
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

ttree uses OpenAI's `cl100k_base` encoding (GPT-3.5/GPT-4) by default. You can specify a different encoding with the `-e` option.

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
│   ├── file-traverser.ts   # Directory traversal logic
│   ├── formatters.ts       # Output formatting utilities
│   ├── gitignore-parser.ts # .gitignore pattern matching
│   ├── index.ts           # Main entry point
│   ├── token-counter.ts   # Token counting logic
│   ├── tree-builder.ts    # Tree structure building
│   ├── tree-renderer.ts   # Output rendering
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Utility functions
├── package.json
├── tsconfig.json
└── README.md
```

## Performance Considerations

- **Large directories**: Use `-d` to limit traversal depth
- **Many files**: Use `-t` to filter by token threshold
- **Binary files**: Automatically skipped to improve performance
- **Memory usage**: Large files (>50MB) are excluded from analysis

## Use Cases

- **AI Development**: Analyze token usage before sending to language models
- **Code Review**: Understand codebase structure and file sizes
- **Documentation**: Generate project overviews with token metrics
- **Optimization**: Identify large files that may need refactoring
- **Cost Estimation**: Calculate potential AI API costs based on token counts

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