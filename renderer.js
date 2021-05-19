const TabGroup = require('electron-tabs');
const dragula = require('dragula');

const tabGroup = new TabGroup({
  ready(tGroup) {
    dragula([tGroup.tabContainer], {
      direction: 'horizontal',
    });
  },
  newTab: {
    title: 'New Tab',
    src: 'https://candlevault.web.app/',
    active: true,
    webviewAttributes: {
      nodeintegration: false,
      preload: './preload.js',
    },
  },
});

tabGroup.on('tab-added', (tab) => {
  tab.on('webview-ready', () => {
    tab.webview.addEventListener('ipc-message', (event) => {
      if (event.channel === 'title') tab.setTitle(event.args[0]);
      else console.log('Unknown event', event);
    });
    tab.webview.send('getTitle');
  });
});

tabGroup.addTab({
  title: 'Main Tab',
  src: 'https://candlevault.web.app/',
  closable: false,
  active: true,
  webviewAttributes: {
    nodeintegration: false,
    preload: './preload.js',
  },
});
