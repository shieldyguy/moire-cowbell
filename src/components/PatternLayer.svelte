<script>
  import { onMount } from "svelte";
  import interact from "interactjs";
  import { generatePatternSVG } from "../lib/patterns";

  export let patternType = "horizontal";
  export let scale = 1;
  export let rotation = 0;
  export let x = 0;
  export let y = 0;
  export let lineSpacing = 20;
  export let lineThickness = 1;

  let element;
  let patternId = `pattern-${Math.random().toString(36).substr(2, 9)}`;
  let patternData;
  let lastAngle = 0;
  let isRotating = false;

  // Constants for transformations
  const SCALE_FACTOR = 0.1;
  const ROTATION_FACTOR = 2;
  const MOVEMENT_FACTOR = 10;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 10;
  const ROTATION_SENSITIVITY = 0.5;

  // Calculate viewport size for proper scaling
  let viewportWidth;
  let viewportHeight;

  function updateViewportSize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  }

  function handleWheel(event) {
    event.preventDefault();

    if (event.altKey) {
      // Alt + wheel for rotation
      rotation += Math.sign(event.deltaY) * ROTATION_FACTOR;
    }
  }

  function handleKeydown(event) {
    switch (event.key) {
      case "ArrowLeft":
        x -= MOVEMENT_FACTOR;
        break;
      case "ArrowRight":
        x += MOVEMENT_FACTOR;
        break;
      case "ArrowUp":
        y -= MOVEMENT_FACTOR;
        break;
      case "ArrowDown":
        y += MOVEMENT_FACTOR;
        break;
    }
  }

  function calculateAngle(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  function handleTouchStart(event) {
    if (event.touches.length === 2) {
      isRotating = true;
      lastAngle = calculateAngle(event.touches[0], event.touches[1]);
    }
  }

  function handleTouchMove(event) {
    if (isRotating && event.touches.length === 2) {
      const currentAngle = calculateAngle(event.touches[0], event.touches[1]);
      let angleDiff = currentAngle - lastAngle;

      // Normalize angle difference to prevent large jumps
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      rotation += angleDiff * ROTATION_SENSITIVITY;
      lastAngle = currentAngle;
    }
  }

  function handleTouchEnd(event) {
    if (event.touches.length < 2) {
      isRotating = false;
    }
  }

  onMount(() => {
    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);

    // Initialize interact.js for drag handling only
    const interactable = interact(element).draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      autoScroll: true,
      listeners: {
        move: dragMoveListener,
      },
    });

    function dragMoveListener(event) {
      x += event.dx;
      y += event.dy;
    }

    // Add touch event listeners for rotation
    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    // Add wheel event listener for zoom and rotation
    element.addEventListener("wheel", handleWheel, { passive: false });
    // Add keyboard listener for arrow key movement
    window.addEventListener("keydown", handleKeydown);

    return () => {
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", updateViewportSize);
      interactable.unset(); // Clean up interact.js
    };
  });

  // Update pattern data when pattern type, spacing, or thickness changes
  $: patternData = generatePatternSVG(patternType, lineSpacing, lineThickness);

  // Calculate pattern transform based on scale
  $: patternScale = 1 / scale;
</script>

<div
  class="pattern-layer"
  bind:this={element}
  style="transform: translate({x}px, {y}px) rotate({rotation}deg) scale({scale})"
>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 {viewportWidth || 1000} {viewportHeight || 1000}"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    shape-rendering="crispEdges"
  >
    <defs>
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        width={patternData?.width || 1000}
        height={patternData?.height || 1000}
        patternTransform="scale({patternScale})"
      >
        {#if patternData?.path}
          <path
            d={patternData.path}
            stroke="white"
            stroke-width={lineThickness}
            fill="none"
            shape-rendering="geometricPrecision"
          />
        {:else if patternData?.circles}
          {#each patternData.circles as { cx, cy, r }}
            <circle
              {cx}
              {cy}
              {r}
              fill="white"
              shape-rendering="geometricPrecision"
            />
          {/each}
        {:else if patternData?.svg}
          {@html patternData.svg}
        {/if}
      </pattern>
    </defs>
    <!-- Extend the rect beyond viewport bounds to ensure seamless tiling -->
    <rect
      x="-100%"
      y="-100%"
      width="300%"
      height="300%"
      fill={`url(#${patternId})`}
    />
  </svg>
</div>

<style>
  .pattern-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    touch-action: none;
    user-select: none;
    outline: none;
    overflow: hidden;
  }

  :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
    image-rendering: optimizeQuality;
  }
</style>
