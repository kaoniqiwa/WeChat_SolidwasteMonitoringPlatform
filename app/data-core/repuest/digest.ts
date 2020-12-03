
import { Md5 } from 'ts-md5/dist/md5'; 

export class Digest {

    private header: string;
    constructor(header?: Headers, realm?: string) {

        if (header) {
            // var realm = SystemUrl.replace('http://', '');
            this.header = 'WWW-Authenticate: ' + header['www-authenticate'].replace('realm=""', `realm="${realm}"`);
        
            
            sessionStorage.setItem('WWW-Authenticate', this.header);
        }
        else {
            this.header = sessionStorage.getItem('WWW-Authenticate');
        }
    }
    buildField(name, value) {
        return value ? name + "=\"" + value + "\", " : "";
    }

    parseServerChallenge(challenge) {
        if (!this.header) {
            return {};
        }
        var splitting = this.header.split(', ');
        challenge = challenge || {};

        if (!splitting.length) {
            return challenge;
        }

        for (var i = 0; i < splitting.length; i++) {

            var values = /([a-zA-Z]+)=\"?([a-zA-Z0-9.@\/\s]+)\"?/.exec(splitting[i]);
            challenge[values[1]] = values[2];
        }

        return challenge;
    }
    generateRequestHeader(_nc, challenge, username, password, method, uri) {

        var nc = ("00000000" + _nc).slice(-8);

        /* Calculate cnonce */
        /* Math.randon().toString(36) -> "0.9g7hgvo99dj".slice(2) -> "9g7hgvo99dj" */
        var cnonce = ("00000000" + Math.random().toString(36).slice(2)).slice(-8);

        /* Calculate response MD5 */
        var ha1 = Md5.hashStr([username, challenge.realm, password].join(":"));
        var ha2 = Md5.hashStr([method, uri].join(":"));
        var response = Md5.hashStr([ha1, challenge.nonce, nc, cnonce, challenge.qop, ha2].join(":"));

        let authHeader = ("Digest " +
            this.buildField("username", username) +
            this.buildField("realm", challenge.realm) +
            this.buildField("nonce", challenge.nonce) +
            this.buildField("uri", uri) +
            this.buildField("algorithm", challenge.algorithm) +
            this.buildField("response", response) +
            this.buildField("opaque", challenge.opaque) +
            this.buildField("qop", challenge.qop) +
            this.buildField("nc", nc) +
            this.buildField("cnonce", cnonce)).slice(0, -2);console.log(authHeader);
            
        return  { 'Authorization': authHeader, 'X-WebBrowser-Authentication': 'Forbidden' };
    }
}


