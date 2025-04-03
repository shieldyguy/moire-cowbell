<script lang="ts">
  import PatternLayer from "./PatternLayer.svelte";
  import EditDrawer from "./EditDrawer.svelte";

  let isDrawerOpen = false;
  let lastClickTime = 0;
  let lastKeyTime = 0;

  // Front pattern state
  let frontPattern = "horizontal";
  let frontLineSpacing = 17;
  let frontLineThickness = 3;
  let frontRotation = 158;

  // Back pattern state
  let backPattern = "horizontal";
  let backLineSpacing = 17;
  let backLineThickness = 4;
  let backRotation = 159;

  // Goo filter controls
  let gooEnabled = false;
  let gooBlurAmount = 1.0;

  function toggleDrawer() {
    isDrawerOpen = !isDrawerOpen;
  }

  function handleContainerClick(event: MouseEvent) {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;

    if (timeDiff < 300) {
      // Double click/tap threshold
      toggleDrawer();
    }

    lastClickTime = currentTime;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastKeyTime;

      if (timeDiff < 300) {
        // Double press threshold
        toggleDrawer();
        event.preventDefault();
      }

      lastKeyTime = currentTime;
    }
  }
</script>

<div
  class="pattern-container"
  on:click={handleContainerClick}
  on:keydown={handleKeydown}
  role="button"
  tabindex="0"
  aria-label="Double click or press twice to open pattern settings"
>
  <svg style="position: absolute; width: 0; height: 0;">
    <defs>
      <filter id="goo-filter">
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation={gooBlurAmount}
          result="blur"
        />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="goo"
        />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
  <div
    class="layers-container"
    style="filter: {gooEnabled ? `url(#goo-filter)` : 'none'}"
  >
    <div class="back-layer">
      <PatternLayer
        patternType={backPattern}
        lineSpacing={backLineSpacing}
        lineThickness={backLineThickness}
        scale={10.0}
        rotation={backRotation}
      />
    </div>

    <div class="front-layer">
      <PatternLayer
        patternType={frontPattern}
        lineSpacing={frontLineSpacing}
        lineThickness={frontLineThickness}
        scale={10.0}
        rotation={frontRotation}
      />
    </div>
  </div>
</div>

<EditDrawer
  bind:isOpen={isDrawerOpen}
  bind:frontPattern
  bind:frontLineSpacing
  bind:frontLineThickness
  bind:frontRotation
  bind:backPattern
  bind:backLineSpacing
  bind:backLineThickness
  bind:backRotation
  bind:gooEnabled
  bind:gooBlurAmount
/>

<style>
  .pattern-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #121212;
    cursor: pointer;
  }

  .pattern-container:focus {
    outline: none;
  }

  .layers-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .back-layer,
  .front-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .back-layer {
    z-index: 1;
  }

  .front-layer {
    z-index: 2;
  }
</style>
