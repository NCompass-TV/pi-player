export const environment = {
  production: false,
  // DotNet Server
  server_url: 'http://44.192.0.172:82/api/',
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
  hasLicense: '/select_data/content/has-license'
};