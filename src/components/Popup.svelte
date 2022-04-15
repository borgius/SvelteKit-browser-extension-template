<script lang="ts">
  // @ts-nocheck
  import Modal, { getModal } from './Modal.svelte';

  const open = () => {
    getModal().open();
  };

  const close = () => {
    console.log('Closed');
  };

  const save = () => {
    console.log('Save');
    getModal().close();
  };
</script>


<input class="btn" value="Click Me!" role="button" tabindex="0" type="button">

<Modal on:close={close}>
  <h2>Hello!</h2>
  
  <button on:click={save}>Save and close</button>
</Modal>

<style>
  .btn {
    background-color: #f8f9fa;
    border: 1px solid #f8f9fa;
    border-radius: 4px;
    color: #3c4043;
    font-family: Roboto,arial,sans-serif;
    font-size: 14px;
    margin: 11px 4px;
    padding: 0 16px;
    line-height: 27px;
    height: 36px;
    min-width: 54px;
    text-align: center;
    cursor: pointer;
    user-select: none;    
  }
</style>
