
export class HowellUri {
    Origin: any;
    AbsoluteUri: any;
    Scheme: any;
    UserInfo: any;
    Authority: any;
    Port: any;
    Host: any;
    PathAndQuery: any;
    AbsolutePath: any;
    Query: any;
    Querys: any;
    Segments: any;
    constructor(uri: string) {
        if (uri.lastIndexOf('#') === uri.length - 1) {
            uri = uri.substr(0, uri.length - 1);
        }
        let temp;
        const schemeIndex = uri.indexOf(':') + 3;
        const userInfoIndex = uri.indexOf('@');
        let authorityIndex = uri.indexOf('/', schemeIndex);
        if (authorityIndex < 0) {
            authorityIndex = uri.length;
        }
        const queryIndex = uri.indexOf('?');

        this.Origin = uri;
        if (queryIndex > 0) {
            this.Origin = uri.substr(0, queryIndex);
        }
        this.AbsoluteUri = uri;
        this.Scheme = uri.substr(0, schemeIndex - 3);

        if (userInfoIndex > 0) {
            this.UserInfo = uri.substr(schemeIndex, userInfoIndex - schemeIndex);
            this.Authority = uri.substr(userInfoIndex + 1, authorityIndex - userInfoIndex - 1);
        } else {
            this.Authority = uri.substr(schemeIndex, authorityIndex - schemeIndex);
        }
        this.Port = 80;
        this.Host = this.Authority;
        if (this.Authority.indexOf(':') > 0) {
            temp = this.Authority.split(':');
            this.Host = temp[0];
            this.Port = temp[1];
        }

        this.PathAndQuery = uri.substr(authorityIndex);

        this.AbsolutePath = this.PathAndQuery;

        if (queryIndex > 0) {
            temp = this.PathAndQuery.split('?');
            this.AbsolutePath = temp[0];
            this.Query = temp[1];
        }
        if (this.Query) {
            const items = this.Query.split('&');
            this.Querys = {};
            for (let i = 0; i < items.length; i++) {
                const index = items[i].indexOf('=');
                this.Querys[items[i].substr(0, index)] = items[i].substr(index + 1);
            }
        }


        this.Segments = null;
        if (this.AbsolutePath !== '') {
            this.Segments = this.AbsolutePath.split('/');
        }
    }
}
