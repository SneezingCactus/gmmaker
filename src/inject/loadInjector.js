import browser from 'webextension-polyfill';

const injectorScript = document.createElement('script');
injectorScript.src = browser.runtime.getURL('js/injector.js');
document.head.prepend(injectorScript);

const loaderScript = document.createElement('script');
loaderScript.src = browser.runtime.getURL('js/gmLoader.js');
document.head.prepend(loaderScript);
