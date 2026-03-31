import { Tray, Menu, nativeImage, BrowserWindow, Notification } from 'electron';
import path from 'path';

let tray: Tray | null = null;

export function createTray(mainWindow: BrowserWindow) {
  // Create a simple 16x16 tray icon using nativeImage
  const icon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABkSURBVDiNY2AYBaNgGAAmEv0/k0T9/xkYGBgYSDbg////DFgNIBYwkWoAIyMjVgOINYRkF4xqGHgDmBgYGBj+EzDgPwMDw38GBgaGswQM+M/AwMBwloGBgeE/AwMDwxkiDAAAIikXEbO+hH4AAAAASUVORK5CYII='
  );

  tray = new Tray(icon.resize({ width: 16, height: 16 }));
  tray.setToolTip('MUFI Console');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show MUFI Console',
      click: () => mainWindow.show(),
    },
    { type: 'separator' },
    {
      label: 'All Agents Online',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        mainWindow.destroy();
        if (tray) tray.destroy();
        process.exit(0);
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

export function sendAgentOfflineNotification(agentName: string) {
  new Notification({
    title: 'Agent Offline',
    body: `${agentName} has gone offline`,
  }).show();
}
