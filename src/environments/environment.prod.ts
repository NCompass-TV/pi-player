export const environment = {
  production: true,
  // DotNet Server
  server_url: 'http://3.212.225.229:82/api/',
  piDownloader: 'pidownloader/getcontents?licensekey=',
  registerLicense: 'license/register',
  
  // Nodejs Server
  public_url: 'http://localhost:3215/api',
  systemInfo: '/systeminfo',
  saveLicense: '/save-settings/',
  saveData: '/save-data',
  selectTemplate: '/template',
  saveDataAndDownload: '/content',
  clearDatabase: '/content/cleardb',
  hasLicense: '/content/has-license',
  saveContentCount: '/save-content-count',
  saveLicensetoDb: '/license/save-license',
  getLicenseFromDb: '/license/get-license',
  resetPlayer: '/content/reset',
  screenshot: '/utils/screenshot',
  playlist: '/playlist/',
  kafka_send_to_broker: '/send-content-count-data',

  // Misc
  pi_socket: 'http://localhost:3215',
  kafka_topic: 'content-count',
};