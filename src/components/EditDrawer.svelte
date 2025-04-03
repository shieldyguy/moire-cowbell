<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { getAvailablePatterns } from '../lib/patterns';

  export let isOpen = false;
  
  // Front pattern controls
  export let frontPattern = 'horizontal';
  export let frontLineSpacing = 20;
  export let frontLineThickness = 1;
  export let frontRotation = 0;
  
  // Back pattern controls
  export let backPattern = 'diagonal';
  export let backLineSpacing = 20;
  export let backLineThickness = 1;
  export let backRotation = 0;

  const drawerPosition = spring(0, {
    stiffness: 0.1,
    damping: 0.4
  });

  let availablePatterns = [];
  let isPortrait = true;

  onMount(() => {
    availablePatterns = getAvailablePatterns();
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    return () => window.removeEventListener('resize', updateOrientation);
  });

  function updateOrientation() {
    isPortrait = window.innerHeight > window.innerWidth;
  }

  $: drawerPosition.set(isOpen ? 0 : 1);

  function handleFrontSpacingChange(event: Event) {
    const input = event.target as HTMLInputElement;
    frontLineSpacing = parseInt(input.value);
  }

  function handleFrontThicknessChange(event: Event) {
    const input = event.target as HTMLInputElement;
    frontLineThickness = parseInt(input.value);
  }

  function handleBackSpacingChange(event: Event) {
    const input = event.target as HTMLInputElement;
    backLineSpacing = parseInt(input.value);
  }

  function handleBackThicknessChange(event: Event) {
    const input = event.target as HTMLInputElement;
    backLineThickness = parseInt(input.value);
  }

  function handlePatternChange(event: Event, isFront: boolean) {
    const select = event.target as HTMLSelectElement;
    if (isFront) {
      frontPattern = select.value;
    } else {
      backPattern = select.value;
    }
  }

  function handleRotationChange(event: Event, isFront: boolean) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    if (isFront) {
      frontRotation = value;
    } else {
      backRotation = value;
    }
  }
</script>

<div 
  class="drawer-container"
  class:portrait={isPortrait}
  style={isPortrait ? 
    `transform: translateY(${$drawerPosition * 100}%)` : 
    `transform: translateX(${$drawerPosition * 100}%)`}
>
  <div class="drawer-content">
    <div class="drawer-header">
      <h2>Pattern Settings</h2>
    </div>
    
    <div class="pattern-section">
      <h3>Front Pattern</h3>
      <div class="control-group">
        <label for="front-pattern">Pattern Type</label>
        <select 
          id="front-pattern" 
          value={frontPattern}
          on:change={(e) => handlePatternChange(e, true)}
        >
          {#each availablePatterns as pattern}
            <option value={pattern.id}>{pattern.name}</option>
          {/each}
        </select>
      </div>

      <div class="control-group">
        <label for="front-spacing">Line Spacing</label>
        <div class="slider-container">
          <input 
            type="range" 
            id="front-spacing" 
            min="5" 
            max="50" 
            value={frontLineSpacing}
            on:input={handleFrontSpacingChange}
          />
          <span class="value">{frontLineSpacing}px</span>
        </div>
      </div>

      <div class="control-group">
        <label for="front-thickness">Line Thickness</label>
        <div class="slider-container">
          <input 
            type="range" 
            id="front-thickness" 
            min="1" 
            max="10" 
            value={frontLineThickness}
            on:input={handleFrontThicknessChange}
          />
          <span class="value">{frontLineThickness}px</span>
        </div>
      </div>

      <div class="control-group">
        <label for="front-rotation">Rotation</label>
        <div class="slider-container">
          <input 
            type="range" 
            id="front-rotation" 
            min="0" 
            max="360" 
            value={frontRotation}
            on:input={(e) => handleRotationChange(e, true)}
          />
          <span class="value">{frontRotation}°</span>
        </div>
      </div>
    </div>

    <div class="pattern-section">
      <h3>Back Pattern</h3>
      <div class="control-group">
        <label for="back-pattern">Pattern Type</label>
        <select 
          id="back-pattern" 
          value={backPattern}
          on:change={(e) => handlePatternChange(e, false)}
        >
          {#each availablePatterns as pattern}
            <option value={pattern.id}>{pattern.name}</option>
          {/each}
        </select>
      </div>

      <div class="control-group">
        <label for="back-spacing">Line Spacing</label>
        <div class="slider-container">
          <input 
            type="range" 
            id="back-spacing" 
            min="5" 
            max="50" 
            value={backLineSpacing}
            on:input={handleBackSpacingChange}
          />
          <span class="value">{backLineSpacing}px</span>
        </div>
      </div>

      <div class="control-group">
        <label for="back-thickness">Line Thickness</label>
        <div class="slider-container">
          <input 
            type="range" 
            id="back-thickness" 
            min="1" 
            max="10" 
            value={backLineThickness}
            on:input={handleBackThicknessChange}
          />
          <span class="value">{backLineThickness}px</span>
        </div>
      </div>

      <div class="control-group">
        <label for="back-rotation">Rotation</label>
        <div class="slider-container">
          <input 
            type="range" 
            id="back-rotation" 
            min="0" 
            max="360" 
            value={backRotation}
            on:input={(e) => handleRotationChange(e, false)}
          />
          <span class="value">{backRotation}°</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .drawer-container {
    position: fixed;
    background: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    overflow-y: auto;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .drawer-container.portrait {
    bottom: 0;
    left: 0;
    width: 100%;
    height: min(90vh, 600px);
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }

  .drawer-container:not(.portrait) {
    top: 0;
    right: 0;
    width: min(400px, 90vw);
    height: 100vh;
  }

  .drawer-content {
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .drawer-header {
    position: sticky;
    top: 0;
    background: white;
    padding: 1rem 0;
    margin: -1rem 0 1rem 0;
    border-bottom: 1px solid #eee;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
    color: #444;
  }

  .pattern-section {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #eee;
  }

  .pattern-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .control-group {
    margin-bottom: 1.5rem;
  }

  .control-group:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #666;
  }

  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    font-size: 1rem;
    color: #333;
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  input[type="range"] {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: #e0e0e0;
    border-radius: 2px;
    outline: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #4a90e2;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  .value {
    min-width: 3rem;
    text-align: right;
    font-family: monospace;
    color: #666;
  }
</style> 