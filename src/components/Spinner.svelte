<div class="spinner" />

<style>
  .spinner {
    /*  control spinner size with setting font-size  */
    font-size: 0.5rem;
    border: 0.4em solid #fff;
    border-top-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    width: 2em;
    height: 2em;
    animation: loading-spinner 2s linear infinite;
    margin: 0 auto;
    box-sizing: border-box;
  }

  @keyframes loading-spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
