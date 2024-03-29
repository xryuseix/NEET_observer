/** @format */

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const TOKEN_PATH = "token.json";

function uploadFile(filename: string) {
  fs.readFile("credentials.json", (err: any, content: any) => {
    if (err) return console.log("Error loading client secret file:", err);
    authorize(JSON.parse(content), createFiles, filename);
  });
}

export default uploadFile;

/**
 * google Drive上でファイルを作成する
 */
async function createFiles(auth: any, filename: string) {
  const drive = google.drive({ version: "v3", auth });

  const fileName = filename;
  const folderId = JSON.parse(fs.readFileSync("./folderID.json", "utf8"))[
    "folder_id"
  ];

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
 * googleAPIの認証を行う
 */
function authorize(credentials: any, callback: any, filename: string) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err: any, token: any) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, filename);
  });
}

/**
 * googleAPIのアクセストークンを取得する
 */
function getAccessToken(oAuth2Client: any, callback: any) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code: any) => {
    rl.close();
    oAuth2Client.getToken(code, (err: any, token: any) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: any) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
