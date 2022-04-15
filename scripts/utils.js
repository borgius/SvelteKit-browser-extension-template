import 'dotenv/config';
import fs from 'fs';
import { resolve } from 'path';
import { execSync, spawnSync } from 'child_process';
import { encrypt, decrypt } from 'crypt-aes';

export const HOME = process.env.HOME;
export const ROOT = new URL('..', import.meta.url).pathname;
export const KEY = resolve(ROOT, 'key.pem');
const chrome = `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`;

const supportedBrowsers = ['google-chrome', 'brave'];

const browsers = {
  'google-chrome': {
    app: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
    lib: `${HOME}/Library/Application Support/Google/Chrome`,
  },
  brave: {
    app: `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`,
    lib: `${HOME}/Library/Application Support/BraveSoftware/Brave-Browser`,
  },
};

export const SECRET = process.env.CONFIG_SECRET;

if (!SECRET)
  throw new Error(
    `Unable to find "CONFIG_SECRET". Please check your .env file`
  );

export const decryptPem = () => {
  if (!fs.existsSync(KEY)) {
    if (fs.existsSync(`${KEY}.caes`)) {
      decrypt({
        srcPath: `${KEY}.caes`,
        pswrd: SECRET,
        keepSrc: true,
        destPath: null,
      });
      if (!fs.existsSync(KEY)) {
        throw new Error(`Unable to decrypt ${KEY}`);
      }
    } else {
      generatePem();
    }
  } else {
    if (!fs.existsSync(`${KEY}.caes`)) {
      encryptPem();
    }
  }
};

export const encryptPem = () => {
  if (fs.existsSync(KEY)) {
    encrypt({
      srcPath: `${KEY}`,
      pswrd: SECRET,
      keepSrc: true,
      destPath: null,
    });
  } else {
    throw new Error(`Unable to find ${KEY}`);
  }
};

export const generatePem = () => {
  execSync(
    `2>/dev/null openssl genrsa 2048 | openssl pkcs8 -topk8 -nocrypt -out ${KEY}`
  );
  encryptPem();
};

export const extensionKey = () => {
  decryptPem();
  return execSync(
    `2>/dev/null openssl rsa -in ${KEY} -pubout -outform DER | openssl base64 -A`
  ).toString();
};

export const extensionId = () => {
  decryptPem();
  return execSync(
    `2>/dev/null openssl rsa -in ${KEY} -pubout -outform DER |  shasum -a 256 | head -c32 | tr 0-9a-f a-p`
  ).toString();
};

export const updateManifestKey = () => {
  const manifest = resolve(ROOT, 'static/manifest.json');
  const json = JSON.parse(fs.readFileSync(manifest));
  json.key = extensionKey();
  fs.writeFileSync(manifest, JSON.stringify(json, null, 2));
  return json.key;
};

export const getManifest = () =>
  JSON.parse(fs.readFileSync(resolve(ROOT, 'static/manifest.json')));

export const getExtensionName = () => `${extensionId()}.crx`;

export const buildExtension = () => {
  console.log('Extension not found, building...');
  log = spawnSync('npm', ['run', ' build'], { shell: true });
};
export const packExtension = () => {
  let log;
  const extSrc = resolve(ROOT, 'build');
  if (!fs.existsSync(resolve(extSrc, 'manifest.json'))) {
    console.log('Extension not found, building...');
    buildExtension();
  }
  const crx = resolve(ROOT, 'build.crx');
  if (fs.existsSync(chrome)) {
    const cmd = `"${chrome}" --pack-extension="${extSrc}" --pack-extension-key="${KEY}" --no-message-box`;
    console.log(cmd);
    log = execSync(cmd).toString();
    console.log(log);
    if (fs.existsSync(crx)) {
      const newName = getExtensionName();
      console.log(`rename to ${newName}`);
      fs.renameSync(crx, resolve(ROOT, newName));
    }
  }
};

export const getAvailabeBrowsers = () =>
  supportedBrowsers.filter((name) => fs.existsSync(browsers[name].app));

export const installLocal = () => {
  const crx = resolve(ROOT, getExtensionName());
  if (!fs.existsSync(crx)) {
    console.log('Extension not found, packing...');
    packExtension();
  }

  const json = {
    external_crx: crx,
    external_version: getManifest().version,
  };

  getAvailabeBrowsers()?.map((name) => {
    const extPath = resolve(browsers[name].lib, `External Extensions`);
    if (!fs.existsSync(extPath)) {
      try {
        fs.mkdirSync(extPath);
      } catch (e) {
        throw new Error(
          `Unable to create a folder, please create it manually: \nsudo mkdir -p "${extPath}"\n\n\n`
        );
      }
    }
    const extJsonPath = resolve(extPath, `${extensionId()}.json`);
    fs.writeFileSync(extJsonPath, JSON.stringify(json, null, 2));
  });
  console.log('Please refresh extensions page');
};
