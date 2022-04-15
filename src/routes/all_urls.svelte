<script lang="ts">
  import { onMount } from 'svelte';
  import { extMetaName } from '../content_scripts/constants';

  let folded = true;
  let ROOT: string = '';

  onMount(async () => {
    ROOT = window[extMetaName].importPrefix.slice(0, -1);
  });
  
</script>

<div id="content" class:folded on:click={() => (folded = !folded)}>
  {#if folded}
    {@debug ROOT}
    <img id="icon" src="{ROOT}/favicon.png" alt="" />
  {:else}
    <h1>Surprise!</h1>
  {/if}
</div>

<style lang="scss">
  #content {
    max-width: 950px;
    position: fixed;
    background: #333;
    padding: 5px;
    color: #fff;
    top: 0;
    right: 0;
    z-index: 100000;
    font-size: 16px;
    font-family: 'Courier New', Courier, monospace;
  }
  
  #icon {
    width: 15px;
  }
  
  .folded {
    background-color: transparent;
    border: 1px solid #aaa;
    border-radius: 5px;
    overflow: hidden;
    max-width: 24px !important;
    max-height: 24px;
  }
</style>
