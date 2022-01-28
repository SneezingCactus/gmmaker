import browser from 'webextension-polyfill';

const script = document.createElement('script');
script.src = browser.runtime.getURL('js/injector.js');
document.head.prepend(script);
