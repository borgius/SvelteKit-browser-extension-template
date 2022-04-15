import { extMetaName } from './constants.js';

export const loadPage = async (
  name,
  parentSelector = 'body',
  prepend = true
) => {
  const parent = document.querySelectorAll(parentSelector)?.[0];
  if (parent) {
    const p = '../meta.js';
    const { meta } = await import(p);
    window[extMetaName] = meta;
    const page = meta.pages.find((el) => el.page.includes(name));
    const styles = meta.css.filter((src) => src.includes(`pages/${name}`));
    await loadStyles(styles);
    const div = document.createElement('div');
    div.innerHTML = `<div ${page.selector}></div>`;
    if (prepend) parent.prepend(div);
    else parent.append(div);
    loadScript(`content_scripts/injectMeta.js`);
    loadScript(page.script);
  }
};

export const loadScript = (script) => {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL(script);
  s.type = "module";
  (document.head || document.documentElement).appendChild(s);
  s.onload = function () {
    s.remove();
  };
}

export const loadStyle = async (src) => {
  return new Promise(function (resolve, reject) {
    let link = document.createElement('link');
    link.href = src;
    link.rel = 'stylesheet';

    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`Style load error for ${src}`));

    document.head.append(link);
  });
};

export const loadStyles = async (srcs) => {
  let promises = [];
  srcs.forEach((src) => promises.push(loadStyle(src)));
  return Promise.all(promises);
};

