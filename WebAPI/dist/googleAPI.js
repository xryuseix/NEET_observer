"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = "token.json";
function uploadFile(filename) {
    fs.readFile("credentials.json", (err, content) => {
        if (err)
            return console.log("Error loading client secret file:", err);
        authorize(JSON.parse(content), createFiles, filename);
    });
}
exports.default = uploadFile;
/**
 * google Drive上でファイルを作成する
 */
async function createFiles(auth, filename) {
    const drive = google.drive({ version: "v3", auth });
    const fileName = filename;
    const folderId = JSON.parse(fs.readFileSync("./folderID.json", "utf8"))["folder_id"];
    const params = {
        resource: {
            name: fileName,
            parents: [folderId],
        },
        media: {
            mimeType: "video/mp4",
            body: fs.createReadStream(fileName),
        },
        fields: "id",
    };
    const res = await drive.files.create(params);
    console.log(res.data);
}
/**
 * googlwAPIの認証を行う
 */
function authorize(credentials, callback, filename) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err)
            return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, filename);
    });
}
/**
 * googleAPIのアクセストークンを取得する
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err)
                return console.error("Error retrieving access token", err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    return console.error(err);
                console.log("Token stored to", TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}
//# sourceMappingURL=googleAPI.js.map