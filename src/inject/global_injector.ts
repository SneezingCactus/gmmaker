void (async () => {
  let bonkScriptResponse;

  if (window.location.href.includes('bonk.io')) {
    bonkScriptResponse = await fetch('https://bonk.io/js/alpha2s.js?real');
  }
  else {
    bonkScriptResponse = await fetch('https://bonkisback.io/js/alpha2s.js?real');
  }

  let src = await bonkScriptResponse.text();

  const bonkCodeInjectors = (window as any).bonkCodeInjectors as ((src: string) => string)[] | undefined;

  if (!bonkCodeInjectors) {
    (window as any).bonkCodeInjectors = [];
    alert('Something went wrong with loading Bonk.io extensions.');
  }
  else {
    for (const injector of bonkCodeInjectors) {
      try {
        src = injector(src);
      }
      catch (error) {
        alert('One of your Bonk.io extensions was unable to be loaded');
        console.error(error);
      }
    }
  }

  const script = document.createElement('script');
  script.text = src;
  document.head.appendChild(script);
  console.log('injectors loaded');
})();
