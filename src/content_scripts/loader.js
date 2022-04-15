(async () => {
  const { loadPage } = await import('./helper.js');
  console.log('origin', window.location.origin)
  if (window.location.origin === 'https://www.google.com') {
    console.log('load gooogle');
    await loadPage('google');
  } else {
    console.log('load all_urls');
    await loadPage('all_urls');
  }
})();
