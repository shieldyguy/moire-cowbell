// Built-in pattern definitions
export const builtInPatterns = {
  horizontal: {
    name: 'Horizontal Lines',
    type: 'builtIn',
    generate: (spacing, thickness) => ({
      path: `M 0,${spacing} L 1000,${spacing}`,
      width: 1000,
      height: spacing * 2
    })
  },
  diagonal: {
    name: 'Diagonal Lines',
    type: 'builtIn',
    generate: (spacing, thickness) => {
      const tileSize = 1000;
      const numLines = Math.ceil(tileSize * 2 / spacing);
      let path = '';
      
      // Draw diagonal lines that extend beyond the tile for seamless tiling
      for (let i = -numLines; i <= numLines; i++) {
        const offset = i * spacing;
        path += `M ${offset},0 L ${offset + tileSize},${tileSize} `;
      }
      
      return {
        path,
        width: tileSize,
        height: tileSize
      };
    }
  }
};

// Pattern registry that combines built-in and custom patterns
export const patternRegistry = {
  ...builtInPatterns
};

// Function to register a new custom pattern
export function registerCustomPattern(id, pattern) {
  patternRegistry[id] = {
    ...pattern,
    type: 'custom'
  };
}

// Function to get all available patterns
export function getAvailablePatterns() {
  return Object.entries(patternRegistry).map(([id, pattern]) => ({
    id,
    name: pattern.name,
    type: pattern.type
  }));
}

// Function to generate pattern SVG
export function generatePatternSVG(patternId, spacing, thickness) {
  const pattern = patternRegistry[patternId];
  if (!pattern) return null;

  if (pattern.type === 'builtIn') {
    return pattern.generate(spacing, thickness);
  } else if (pattern.type === 'custom') {
    // For custom patterns, we'll use the provided SVG
    return {
      svg: pattern.svg,
      width: pattern.width || 100,
      height: pattern.height || 100
    };
  }
} 