<script lang="ts">
    let url = "";

    async function getUrl() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        url = tab.url;
    }
</script>
<div id="popup-window" style="width: 400px;height: 500px">
    <button on:click={getUrl}>Reveal Current URL</button>

    <div>The current URL is: {url}</div>

    <p>note: check <a href="https://www.google.com">https://www.google.com</a> for injected button, or any other page to injected pop-up</p>
</div>

<style>
    #popup-window {
        box-sizing: border-box;
        padding: 8px;
        max-width: 800px;
        max-height: 600px;
        min-width: 200px;
        min-height: 150px;
        resize: vertical;
        overflow: auto;
    }
</style>
