export class ContentLog {
    topic: string;
    message: ContentLogData;

    constructor(topic: string, message: ContentLogData) {
        this.topic = topic;
        this.message = message;
    }
}

export class ContentLogData {
    content_id: string;
    timestap: string;
    license_id: string;

    constructor(license_id: string, content_id: string, timestap: string, ) {
        this.content_id = content_id;
        this.timestap = timestap;
        this.license_id = license_id;
    }
}
