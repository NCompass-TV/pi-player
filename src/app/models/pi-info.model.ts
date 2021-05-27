export class PiInfo {
    appVersion: string;
    licensekey: string;
    macaddress: string;
    memory: string;
    internettype: string;
    internetspeed: string;
    totalstorage: string;
    freestorage: string;

    constructor(
        key: string, mac: string, memory: string,
        net_type: string, net_speed: string, total_storage: string,
        free_storage: string, appVersion: string,
    ) {
        this.licensekey = key;
        this.macaddress = mac;
        this.memory = memory;
        this.internettype = net_type;
        this.internetspeed = net_speed;
        this.totalstorage = total_storage;
        this.freestorage = free_storage;
        this.appVersion = appVersion;
    }
}
