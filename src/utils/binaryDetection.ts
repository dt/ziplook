export interface BinaryDetectionResult {
  isBinary: boolean;
  reason?: string;
  fileType?: string;
}

const BINARY_EXTENSIONS = new Set([
  // Images
  "pprof",
]);

const TEXT_EXTENSIONS = new Set([
  "txt",
  "md",
  "json",
  "xml",
  "html",
  "htm",
  "css",
  "js",
  "ts",
  "jsx",
  "tsx",
  "py",
  "rb",
  "go",
  "java",
  "c",
  "cpp",
  "h",
  "hpp",
  "cs",
  "php",
  "sh",
  "bash",
  "sql",
  "csv",
  "tsv",
  "log",
  "yaml",
  "yml",
  "toml",
  "ini",
  "cfg",
  "conf",
  "proto",
  "graphql",
  "dockerfile",
  "makefile",
  "gitignore",
  "license",
  "readme",
  "changelog",
  "manifest",
  "properties",
  "env",
]);

function detectBinaryByExtension(filename: string): BinaryDetectionResult {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (!ext) {
    return { isBinary: false, reason: "No file extension" };
  }

  if (BINARY_EXTENSIONS.has(ext)) {
    return {
      isBinary: true,
      reason: `File extension '.${ext}' indicates binary format`,
      fileType: ext,
    };
  }

  if (TEXT_EXTENSIONS.has(ext)) {
    return {
      isBinary: false,
      reason: `File extension '.${ext}' indicates text format`,
      fileType: ext,
    };
  }

  return {
    isBinary: false,
    reason: `Unknown extension '.${ext}', assuming text`,
  };
}

function detectBinaryByContent(
  content: string,
  maxBytes: number = 4096,
): BinaryDetectionResult {
  if (!content) {
    return { isBinary: false, reason: "Empty content" };
  }

  // Check first chunk of content for binary indicators
  const chunk = content.slice(0, maxBytes);

  // Count null bytes and other control characters
  let nullBytes = 0;
  let controlChars = 0;
  let highBitChars = 0;
  let invalidUnicodeChars = 0;

  for (let i = 0; i < chunk.length; i++) {
    const charCode = chunk.charCodeAt(i);

    if (charCode === 0) {
      nullBytes++;
    } else if (
      charCode < 32 &&
      charCode !== 9 &&
      charCode !== 10 &&
      charCode !== 13
    ) {
      // Control characters except tab, newline, carriage return
      controlChars++;
    } else if (charCode > 127) {
      // High-bit characters (might be UTF-8 or binary)
      highBitChars++;
    }

    // Check for invalid Unicode characters
    // Unicode replacement character (0xFFFD) indicates invalid UTF-8 sequences
    if (charCode === 0xfffd) {
      invalidUnicodeChars++;
    }

    // Check for unpaired surrogates (invalid Unicode)
    if (charCode >= 0xd800 && charCode <= 0xdbff) {
      // High surrogate, check if it's properly paired
      if (
        i + 1 >= chunk.length ||
        chunk.charCodeAt(i + 1) < 0xdc00 ||
        chunk.charCodeAt(i + 1) > 0xdfff
      ) {
        invalidUnicodeChars++;
      }
    } else if (charCode >= 0xdc00 && charCode <= 0xdfff) {
      // Low surrogate without high surrogate
      invalidUnicodeChars++;
    }
  }

  const totalChars = chunk.length;
  const controlRatio = controlChars / totalChars;

  // If there are null bytes, it's likely binary
  if (nullBytes > 0) {
    return {
      isBinary: true,
      reason: `Contains ${nullBytes} null bytes`,
    };
  }

  // If there are invalid Unicode sequences, it's likely binary
  if (invalidUnicodeChars > 0) {
    return {
      isBinary: true,
      reason: `Contains ${invalidUnicodeChars} invalid Unicode characters`,
    };
  }

  // If there are too many control characters, it's likely binary
  if (controlRatio > 0.1) {
    return {
      isBinary: true,
      reason: `High ratio of control characters (${(controlRatio * 100).toFixed(1)}%)`,
    };
  }

  // Check for common binary file signatures
  const signatures = [
    { pattern: "\x89PNG\r\n\x1a\n", type: "PNG image" },
    { pattern: "\xFF\xD8\xFF", type: "JPEG image" },
    { pattern: "GIF8", type: "GIF image" },
    { pattern: "BM", type: "BMP image" },
    { pattern: "PK\x03\x04", type: "ZIP archive" },
    { pattern: "PK\x05\x06", type: "ZIP archive" },
    { pattern: "Rar!", type: "RAR archive" },
    { pattern: "\x7FELF", type: "ELF executable" },
    { pattern: "MZ", type: "Windows executable" },
    { pattern: "\xCA\xFE\xBA\xBE", type: "Java class file" },
    { pattern: "%PDF", type: "PDF document" },
    { pattern: "\x00\x00\x01\x00", type: "ICO image" },
    { pattern: "WEBP", type: "WebP image" },
  ];

  for (const sig of signatures) {
    if (chunk.startsWith(sig.pattern)) {
      return {
        isBinary: true,
        reason: `File signature indicates ${sig.type}`,
        fileType: sig.type,
      };
    }
  }

  return {
    isBinary: false,
    reason: "Content appears to be text",
  };
}

export function detectBinary(
  filename: string,
  content?: string,
): BinaryDetectionResult {
  // First check by extension
  const extensionResult = detectBinaryByExtension(filename);

  // If extension indicates binary, trust it
  if (extensionResult.isBinary) {
    return extensionResult;
  }

  // If we have content, also check content
  if (content !== undefined) {
    const contentResult = detectBinaryByContent(content);

    // If content indicates binary, trust it over extension
    if (contentResult.isBinary) {
      return contentResult;
    }
  }

  // Default to extension result (which would be false for unknown extensions)
  return extensionResult;
}

export function getFileTypeDescription(
  result: BinaryDetectionResult,
  filename: string,
): string {
  if (result.fileType) {
    return result.fileType;
  }

  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext) {
    const typeMap: Record<string, string> = {
      jpg: "JPEG image",
      jpeg: "JPEG image",
      png: "PNG image",
      gif: "GIF image",
      svg: "SVG image",
      pdf: "PDF document",
      zip: "ZIP archive",
      exe: "Windows executable",
      dmg: "macOS disk image",
      mp3: "MP3 audio",
      mp4: "MP4 video",
      avi: "AVI video",
    };

    return typeMap[ext] || `${ext.toUpperCase()} file`;
  }

  return "Binary file";
}
