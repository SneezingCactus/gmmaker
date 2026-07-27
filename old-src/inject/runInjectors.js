(async () => {
  let bonkScriptResponse;

  if (window.location.href.includes('bonk.io')) {
    bonkScriptResponse = await fetch('https://bonk.io/js/alpha2s.js?real');
  } else {
    bonkScriptResponse = await fetch('https://bonkisback.io/js/alpha2s.js?real');
  }

  let src = await bonkScriptResponse.text();

  if (!window.bonkCodeInjectors) {
    window.bonkCodeInjectors = [];
    alert('Something went wrong with loading Bonk.io extensions.');
  }
  for (const inj of window.bonkCodeInjectors) {
    try {
      src = inj(src);
    } catch (error) {
      alert('One of your Bonk.io extensions was unable to be loaded');
      console.error(error);
    }
  }
  const script = document.createElement('script');
  script.text = src;
  document.head.appendChild(script);
  console.log('injectors loaded');
})();
