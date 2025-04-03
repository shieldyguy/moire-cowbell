// Built-in pattern definitions
export const builtInPatterns = {
    lines: {
        name: 'Lines',
        type: 'builtIn',
        sliderSettings: {
            spacing: { min: 1, max: 50 },
            thickness: { min: 1, max: 10 }
        },
        generate(spacing, thickness) {
            const numLines = 20; // or compute based on viewport
            const tileHeight = numLines * spacing;
            let path = '';

            for (let i = 0; i < numLines; i++) {
                const y = i * spacing + thickness / 2;
                path += `M 0,${y} L 1000,${y} `;
            }

            return {
                path: path.trim(),
                width: 1000,
                height: tileHeight // Ensure full visibility
            };
        }
    },
    dots: {
        name: 'Dots',
        type: 'builtIn',
        sliderSettings: {
            spacing: { min: 1, max: 50 },
            thickness: { min: 1, max: 50 }
        },
        generate: (spacing, thickness) => {
            const tileSize = spacing * 10; // or any multiple
            const dots = [];

            for (let y = spacing / 2; y < tileSize; y += spacing) {
                for (let x = spacing / 2; x < tileSize; x += spacing) {
                    dots.push(drawDot(x, y, thickness));
                }
            }

            return {
                circles: dots,
                width: tileSize,
                height: tileSize
            };
        }
    },
    hexdots: {
        name: 'Hexagonal Dots',
        type: 'builtIn',
        sliderSettings: {
            spacing: { min: 1, max: 50 },
            thickness: { min: 1, max: 50 }
        },
        generate: (spacing, thickness) => {
            const tileWidth = spacing * 2;  // fits two points horizontally
            const tileHeight = Math.sqrt(3) * spacing; // vertical spacing between rows

            const dots = [];

            const cols = 10;
            const rows = 10;

            for (let row = -1; row < rows + 1; row++) {
                for (let col = -1; col < cols + 1; col++) {
                    const x = col * tileWidth + (row % 2 === 0 ? 0 : tileWidth / 2);
                    const y = row * tileHeight * 0.5;
                    dots.push(drawDot(x, y, thickness));
                }
            }

            const width = cols * tileWidth;
            const height = rows * tileHeight * 0.5;

            return {
                circles: dots,
                width,
                height
            };
        }
    }
};

export function drawDot(cx, cy, r) {
    return { cx, cy, r };
}

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