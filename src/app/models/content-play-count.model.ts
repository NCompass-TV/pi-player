export class ContentPlayCount {
    license_id: string;
    content_id: string;

    constructor(license: string, content: string) {
        this.license_id = license;
        this.content_id = content;
    }
}
