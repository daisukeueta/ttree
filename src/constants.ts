export const DEFAULT_IGNORE_PATTERNS = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '.next/**',
  '.vscode/**',
  '.idea/**',
  '*.log',
  '.DS_Store',
  'Thumbs.db'
]

export const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.zip', '.rar', '.7z', '.tar', '.gz',
  '.exe', '.dll', '.so', '.dylib',
  '.mp3', '.mp4', '.avi', '.mov', '.wmv',
  '.woff', '.woff2', '.ttf', '.eot'
])

export const TEXT_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
  '.py', '.rb', '.php', '.go', '.rs', '.java', '.kt', '.scala', '.dart',
  '.c', '.cpp', '.h', '.hpp', '.cs', '.swift',
  '.html', '.htm', '.css', '.scss', '.sass', '.less',
  '.json', '.xml', '.yaml', '.yml', '.toml',
  '.md', '.mdx', '.txt', '.rst', '.tex',
  '.sql', '.sh', '.bash', '.zsh', '.fish',
  '.dockerfile', '.gitignore', '.gitattributes',
  '.env', '.config', '.ini'
])

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const DEFAULT_MAX_DEPTH = 10
export const DEFAULT_ENCODING = 'o200k_base' // GPT-4o encoding