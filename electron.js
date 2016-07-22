const electron = require('electron')


const {app, BrowserWindow, ipcMain, Tray} = electron
const path = require('path')

const electronOauth2 = require('electron-oauth2');

var config = {
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    authorizationUrl: 'https://192.84.19.117:8445/sso/login?bg=0',
    tokenUrl: 'TOKEN_URL',
    useBasicAuthorizationHeader: false,
    redirectUri: 'http://localhost'
};

app.on('ready', () => {
  const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false
    }
  }

  const options = {
    scope: 'SCOPE',
    accessType: 'ACCESS_TYPE'
  };

  const myApiOauth = electronOauth2(config, windowParams);

  myApiOauth.getAccessToken(options)
    .then(token => {
      // use your token.access_token

      myApiOauth.refreshToken(token.refresh_token)
        .then(newToken => {
          //use your new token
        });
    });
});