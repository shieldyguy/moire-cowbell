// Built-in pattern definitions
export const builtInPatterns = {
  horizontal: {
    name: 'Horizontal Lines',
    type: 'builtIn',
    sliderSettings: {
      spacing: { min: 5, max: 50 },
      thickness: { min: 1, max: 10 }
    },
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
  circles: {
    name: 'Concentric Circles',
    type: 'builtIn',
    sliderSettings: {
      spacing: { min: 20, max: 500 },
      thickness: { min: 1, max: 10 }
    },
    generate: (spacing, thickness) => {
      const tileSize = 5000;
      const centerX = tileSize / 2;
      const centerY = tileSize / 2;
      const maxRadius = tileSize / 2; // Use half the tile size as maximum radius
      const numCircles = Math.ceil(maxRadius / spacing);
      let path = '';
      
      // Draw concentric circles from the center
      for (let i = 1; i <= numCircles; i++) {
        const radius = i * spacing;
        // Draw a complete circle using two half-circle arcs
        path += `M ${centerX - radius},${centerY} `; // Start from the left point
        path += `A ${radius},${radius} 0 0 1 ${centerX + radius},${centerY} `; // Draw top half
        path += `A ${radius},${radius} 0 0 1 ${centerX - radius},${centerY} `; // Draw bottom half
      }
      
      return {
        path,
        width: tileSize,
        height: tileSize,
        noTile: true // Signal that this pattern shouldn't be tiled
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
    type: pattern.type,
    sliderSettings: pattern.sliderSettings
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