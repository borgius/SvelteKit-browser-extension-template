<script>
  // @ts-nocheck
  import Popup from '../components/Popup.svelte';
  import { onMount } from 'svelte';

  onMount(async () => {
    document.querySelectorAll('input[value="Google Search"]').map((btn) => {
      console.log({ searchButton });
      new Popup({
        target: btn.parentNode,
        anchor: btn,
      });
    });
  });
</script>
