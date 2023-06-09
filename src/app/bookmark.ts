export class Bookmark {
    name: string;
    url: string;
    clickCount:number;

    constructor (name: string, url: string, clickCount: number){
        this.name = name;
        this.url = url;
        this.clickCount = clickCount;
    }

}