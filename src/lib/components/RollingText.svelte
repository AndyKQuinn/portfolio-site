<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { FlyParams } from 'svelte/transition';

  /**
   * @type {string[]} texts - An array of strings to display.
   * @default ['Text 1', 'Text 2', 'Text 3', 'Text 4']
   */
  export let texts: string[] = ['Professional Developer', 'Engineering Coach', 'Documentation Nerd', 'Diversity Advocate', 'Infinitely Curious'];

  /**
   * @type {number}
   * @default 3000
   */
  export let interval: number = 3000;

  let currentTextIndex: number = 0;
  let textToDisplay: string = texts[currentTextIndex];
  let timeoutId: ReturnType<typeof setInterval> | undefined;

  const flyInParams: FlyParams = {
    y: 20,
    duration: 500,
  };

  const flyOutParams: FlyParams = {
    y: -20,
    duration: 500,
  };

  function advanceText(): void {
    if (texts.length === 0) {
      textToDisplay = '';
      return;
    }
    currentTextIndex = (currentTextIndex + 1) % texts.length;
    textToDisplay = texts[currentTextIndex];
  }

  onMount(() => {
    if (texts.length === 0) {
      console.warn('TextScroller: The "texts" prop is empty. No text will be displayed.');
      textToDisplay = '';
      return;
    }

    if (!textToDisplay && texts.length > 0) {
      textToDisplay = texts[currentTextIndex];
    }
    timeoutId = setInterval(advanceText, interval);
  });

  onDestroy(() => {
    if (timeoutId) {
      clearInterval(timeoutId);
    }
  });

  $: if (texts) {
    if (texts.length > 0) {
      if (currentTextIndex >= texts.length) {
        currentTextIndex = 0;
      }
      textToDisplay = texts[currentTextIndex];
    } else {
      textToDisplay = '';
      if (timeoutId) {
        clearInterval(timeoutId);
        timeoutId = undefined;
      }
    }
  }
</script>

<div
  class="
    overflow-hidden
    flex
    items-center
    justify-center
    py-[40px]
    relative
    min-w-[120px]
    text-2xl
    font-serif
    [background:linear-gradient(90deg,#a78bfa_20%,#f472b6_80%)]
    [--tw-shadow-color:rgba(236,72,153,0.15)]
    [text-shadow:0_2px_18px_rgba(236,72,153,0.15),0_1px_0_#fff]
    "
    style="
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    "
>
  {#if textToDisplay}
    {#key textToDisplay}
      <div
        class="absolute whitespace-nowrap"
        in:fly={flyInParams}
        out:fly={flyOutParams}
      >
        {textToDisplay}
      </div>
    {/key}
  {/if}
</div>
