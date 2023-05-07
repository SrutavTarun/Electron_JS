const { app, BrowserWindow, contextBridge } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


app.on('ready', async () => {
  console.log('App ready');

  try {
    // Dynamically import the Chrome Extensions API
    const chrome = await import('../node_modules/chrome-aws-lambda/');

    // Access the chrome.tabs object
    console.log(chrome);

    // async function takeScreenshot(url) {
    //   const browser = await chrome.puppeteer.launch({
    //     args: chrome.args,
    //     defaultViewport: chrome.defaultViewport,
    //     executablePath: await chrome.executablePath,
    //     headless: true, // set to false to see the browser in action
    //     ignoreHTTPSErrors: true, // ignore HTTPS errors
    //   });
    //   const page = await browser.newPage();
    //   await page.goto(url, { waitUntil: 'networkidle2' });
    //   const screenshot = await page.screenshot({ encoding: 'base64' });
    //   await browser.close();
    //   return screenshot;
    // }
    

    const chromeTabs = chrome.tabs;

    console.log(chromeTabs)

    // Get all currently open tabs
    chromeTabs.query({}, (tabs) => {
      console.log('All tabs', tabs);
      tabs.forEach((tab) => {
        // Do something with each tab
        console.log(tab.title);
      });
    });

    // Listen for tab events
    chromeTabs.onCreated.addListener((tab) => {
      console.log('New tab created:', tab.title);
    });

    chromeTabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      console.log('Tab updated:', tab.title);
    });

    chromeTabs.onRemoved.addListener((tabId, removeInfo) => {
      console.log('Tab closed:', removeInfo.title);
    });
  } catch (error) {
    console.error(error);
  }
});

