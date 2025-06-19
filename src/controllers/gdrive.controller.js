import path from 'path';
import mime from 'mime';
import * as fs from 'fs';
import { google } from 'googleapis';
import { createInterface } from 'readline';

async function gDriveApi() {
  return new Promise(async (resolve, reject) => {
    try {
      const gCredentialsFile = fs.readFileSync(path.join(process.cwd(), ".data", "credenciais", "gCredentials.json"));
      return resolve(await authController(JSON.parse(gCredentialsFile)));
    } catch (err) {
      console.error("Erro ao ler o arquivo de credenciais do Google Drive:", err);
      return reject(err);
    }

  });
}

async function authController(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const tokenPath = path.join(process.cwd(), ".data", "credenciais", "gToken.json"); 
  
  if (fs.existsSync(tokenPath)) {
    oAuth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        fs.writeFileSync(tokenPath, JSON.stringify(Object.assign(JSON.parse(fs.readFileSync(tokenPath, (err, token) => token)), tokens)));
      }
      fs.writeFileSync(tokenPath, JSON.stringify(Object.assign(JSON.parse(fs.readFileSync(tokenPath, (err, token) => token)), tokens)));
    });

    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(tokenPath, (err, token) => token)));
    return oAuth2Client;
  } else {
    return await acessTokenController(tokenPath, oAuth2Client).then((auth) => auth).catch((e) => e);
  }
}

async function acessTokenController(tokenPath, oAuth2Client) {
  return new Promise((resolve, reject) => {
    console.log('Autorize o app acessando esse link: ', oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: "https://www.googleapis.com/auth/drive" }));
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    rl.question('Insira o codigo exibido na pagina: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        console.log(err);
        if (err) return reject(err);
        oAuth2Client.setCredentials(token);
        try {
          fs.writeFileSync(tokenPath, JSON.stringify(token));
        } catch (e) {
          console.log(err);
          return reject(err);
        }
        return resolve(oAuth2Client);
      });
    })
  })
}

async function databaseUpload(fileName, filePath) {
  return new Promise((resolve, reject) => {
    gDriveApi()
      .then((auth) => {
        const drive = google.drive({ version: 'v3', auth });
        drive.files.create({
          resource: { name: fileName, parents: ["19njarhF7Q8iEzIQ-j5fhgX3KIy9SQPBF"], },
          media: { mimeType: mime.getType(filePath), body: fs.createReadStream(filePath) },
          fields: 'id'
        }, (err, file) => {
          if (err) return reject(err);
          return resolve(file.data.id);
        });
      })
      .catch((error) => console.log(error));
  });

}

export { databaseUpload, gDriveApi };