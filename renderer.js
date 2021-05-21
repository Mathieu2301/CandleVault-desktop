/* eslint-disable no-undef */
const fs = require('fs');
const TabGroup = require('electron-tabs');
const dragula = require('dragula');

const savedTabs = {};

if (fs.existsSync('./tabs.json')) {
  Object.values(JSON.parse(
    fs.readFileSync('./tabs.json', 'utf8') || '{}',
  )).forEach((val, i) => {
    savedTabs[i] = val;
  });
}

function saveConfig() {
  fs.writeFileSync('./tabs.json', JSON.stringify(savedTabs));
}

function genCircle(color = 'ddd') {
  return `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 height='10' width='10'%3E%3Ccircle cx='5' cy='5' r='5' fill='%23${color}'/%3E%3C/svg%3E`;
}

const tabGroup = new TabGroup({
  ready(tGroup) {
    dragula([tGroup.tabContainer], {
      direction: 'horizontal',
    });
  },
});

tabGroup.on('tab-added', (tab) => {
  tab.on('webview-ready', () => {
    tab.webview.addEventListener('ipc-message', (event) => {
      if (event.channel === 'page') {
        const page = event.args[0];
        tab.setTitle(page.title);
        savedTabs[tab.id] = {
          ...savedTabs[tab.id],
          URL: page.URL,
          session: (tab.webview.partition || 'ddd').split(':').pop(),
        };
        saveConfig();
      }
    });

    tab.webview.send('getTitle');
  });
});

tabGroup.on('tab-removed', (tab) => {
  delete savedTabs[tab.id];
  saveConfig();
});

if (!Object.keys(savedTabs).length) {
  tabGroup.addTab({
    title: 'Main Tab',
    src: 'https://candlevault.web.app/',
    iconURL: genCircle(),
    closable: false,
    active: true,
    webviewAttributes: {
      nodeintegration: false,
      preload: './preload.js',
      partition: 'persist:ddd',
    },
  });
}

Object.keys(savedTabs).forEach((tabID) => {
  const tab = savedTabs[tabID];
  tabGroup.addTab({
    title: 'Loading...',
    src: tab.URL,
    iconURL: genCircle(tab.session || 'ddd'),
    closable: tabID > 0,
    active: !!tab.active,
    webviewAttributes: {
      nodeintegration: false,
      preload: './preload.js',
      partition: `persist:${tab.session || 'ddd'}`,
    },
  });
});

tabGroup.on('tab-active', (activeTab) => {
  if (!savedTabs[activeTab.id]) return;
  Object.keys(savedTabs).forEach((id) => {
    if (id !== activeTab.id && savedTabs[id]) savedTabs[id].active = false;
  });
  savedTabs[activeTab.id].active = true;
  saveConfig();
});

window.newTab = () => {
  const session = localStorage.getItem('selectedSession') || 'ddd';
  tabGroup.addTab({
    title: 'Loading...',
    src: 'https://candlevault.web.app/',
    iconURL: genCircle(session),
    closable: true,
    active: true,
    webviewAttributes: {
      nodeintegration: false,
      preload: './preload.js',
      partition: `persist:${session}`,
    },
  });
};
