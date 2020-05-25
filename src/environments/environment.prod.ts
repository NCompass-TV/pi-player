export const environment = {
  production: false,
  // DotNet Server
  server_url: 'http://3.212.225.229:72/api/',
  piDownloader: 'pidownloader/getcontents?licensekey=',
  registerLicense: 'license/register',
  
  // Nodejs Server
  public_url: 'http://localhost:3215',
  systemInfo: '/systeminfo',
  saveLicense: '/save-settings/',
  saveData: '/save-data',
  selectTemplate: '/select_data/template',
  saveDataAndDownload: '/select_data/content',
  clearDatabase: '/select_data/content/cleardb',
  hasLicense: '/select_data/content/has-license',
  saveLicensetoDb: '/license/save-license',
  getLicenseFromDb: '/license/get-license',
  resetPlayer: '/select_data/content/reset',
  screenshot: '/utils/screenshot',

  // Socket Server
  socket_server: 'http://3.212.225.229:73',
  pi_socket: 'http://localhost:3215'
};