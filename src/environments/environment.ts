export const environment = {
  production: false,
  // DotNet Server
  server_url: 'http://52.73.23.100:82/api/',
  piDownloader: 'pidownloader/getcontents?licensekey=',
  registerLicense: 'license/register',
  
  // Nodejs Server
  public_url: 'http://localhost:3215',
  systemInfo: '/api/systeminfo',
  saveLicense: '/api/save-settings/',
  saveData: '/api/save-data',
  selectTemplate: '/api/template',
  saveDataAndDownload: '/api/content',
  clearDatabase: '/api/content/cleardb',
  hasLicense: '/api/content/has-license',
  saveContentCount: '/api/save-content-count',
  saveLicensetoDb: '/api/license/save-license',
  getLicenseFromDb: '/api/license/get-license',
  resetPlayer: '/api/content/reset',
  refetchPlayer: '/api/content/refetch',
  screenshot: '/api/utils/screenshot',
  playlist: '/api/playlist/',
  kafka_send_to_broker: '/send-content-count-data',

  // Misc
  pi_socket: 'http://localhost:3215',
  socket_server: 'http://52.73.23.100:83',
  kafka_topic: 'content-count'
};