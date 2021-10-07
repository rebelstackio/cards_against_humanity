
'use strict'

import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import dotenv from 'dotenv';

let mainWindow
let isDevelopment = true;

const env = dotenv.config({
	path: path.resolve(process.cwd(),'.env')
}).parsed;

// Reduce it to a nice object, the same as before
Object.keys(env).reduce((prev, next) => {
	prev[`process.env.${next}`] = JSON.stringify(env[next]);
	return prev;
}, {});

function createMainWindow() {
	const window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		}
	})

	if (isDevelopment) {
		window.webContents.openDevTools()
	}

	if (isDevelopment) {
		window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
	}
	else {
		window.loadURL(formatUrl({
			pathname: path.join(__dirname+'/public/', 'index.html'),
			protocol: 'file',
			slashes: true
		}))
	}

	window.on('closed', () => {
		mainWindow = null
	})

	window.webContents.on('devtools-opened', () => {
		window.focus()
		setImmediate(() => {
			window.focus()
		})
	})

	return window
}

// create main BrowserWindow when electron is ready
app.on('ready', () => {
	mainWindow = createMainWindow()
})
