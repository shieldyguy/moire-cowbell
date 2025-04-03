// Built-in pattern definitions
export const builtInPatterns = {
  horizontal: {
    name: 'Horizontal Lines',
    type: 'builtIn',
    generate: (spacing, thickness) => {
      const tileSize = 1000;
      const numLines = Math.ceil(tileSize / spacing) + 2; // Add extra lines for seamless tiling
      let path = '';
      
      // Draw horizontal lines that extend beyond the tile for seamless tiling
      for (let i = -1; i <= numLines; i++) {
        const y = i * spacing;
        path += `M 0,${y} L ${tileSize},${y} `;
      }
      
      return {
        path,
        width: tileSize,
        height: tileSize
      };
    }
  },
  diagonal: {
    name: 'Diagonal Lines',
    type: 'builtIn',
    generate: (spacing, thickness) => {
      const tileSize = 1000;
      const numLines = Math.ceil(tileSize * 2 / spacing) + 2; // Add extra lines for seamless tiling
      let path = '';
      
      // Draw diagonal lines that extend beyond the tile for seamless tiling
      for (let i = -numLines; i <= numLines; i++) {
        const offset = i * spacing;
        // Extend lines beyond tile boundaries for perfect tiling
        path += `M ${offset - tileSize},0 L ${offset + tileSize * 2},${tileSize * 2} `;
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