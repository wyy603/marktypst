import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.bundle.js'
import { createTypstCompiler } from '@myriaddreamin/typst.ts/dist/esm/compiler.mjs';
import { createTypstRenderer } from '@myriaddreamin/typst.ts/dist/esm/renderer.mjs';
import { h, htmlToVNode } from '../snabbdom'
import { CLASS_OR_ID } from '../../../config'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'

// let compiler = null
// let renderer = null
async function initializeTypst() {
  // if(!compiler) {
  //   compiler = window.TypstCompileModule.createTypstCompiler();
  //   await compiler.init({getModule: () =>
  //       'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm'});
  // }
  // if(!renderer) {
  //   renderer = window.TypstRenderModule.createTypstRenderer()
  //   await renderer.init({getModule: () =>
  //     'https://cdn.jsdelivr.net/npm/@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm'});
  // }
  try {
    $typst.setCompilerInitOptions({
      getModule: () =>
        '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm'
    })
    $typst.setRendererInitOptions({
      getModule: () =>
        '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm'
    })
  } catch (err) {
    
  }
}

function substringBetweenHashAndDot(str) {
  const start = str.indexOf('#');
  const end = str.indexOf('.', start);
  if (start === -1 || end === -1 || end <= start) return '';
  return str.substring(start + 1, end);
}
function substringFromSecondChar(str) {
  return str.substring(1);
}
function hashToAZString(str, length = 8) {
  // DJB2 哈希算法
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + c
  }
  hash = hash >>> 0; // 转成无符号32位整数

  const chars = [];
  for (let i = 0; i < length; i++) {
    // 从 hash 的不同部分取值，映射到 a~z (26个字母)
    const charCode = 97 + (hash % 26);
    chars.push(String.fromCharCode(charCode));
    hash = Math.floor(hash / 26);
  }

  return chars.join('');
}
function replaceSlashInAttrs(vnode) {
  if (!vnode || typeof vnode !== 'object') return;

  const { sel, data = {}, children } = vnode;
  const attrs = data.attrs;
  if (attrs) {
    if (sel.substr(0, 4) === 'path') {
      const start = sel.indexOf('#') + 1;
      const end = sel.indexOf('.', start);
      if(sel.slice(end) === ".outline_glyph") {
        vnode.sel = sel.slice(0, start) + hashToAZString(sel.slice(start, end)) + sel.slice(end)
      }
    }
    if (sel === 'use' && typeof attrs.href === 'string') {
      const start = attrs.href.indexOf('#') + 1;
      attrs.href = attrs.href.slice(0, start) + hashToAZString(attrs.href.slice(start))
    }
  }

  if (children && Array.isArray(children)) {
    children.forEach(child => replaceSlashInAttrs(child));
  }
}

export async function renderToSVGString(code, displayMode) {
  await initializeTypst()

  let templates = [null, null, null];
  templates[0] = `
#show math.equation: set text(size: 18pt)
#set page(height: auto, width: auto, margin: 0pt)

#let s = state("t", (:))

#let pin(t) = context {
  let width = measure(line(length: here().position().y)).width
  s.update(it => it.insert(t, width) + it)
}

#show math.equation: it => {
  box(it, inset: (top: 0.35em, bottom: 0em))
}

$pin("l1")${code}$

#context [
  #metadata(s.final().at("l1")) <label>
]
`;

  templates[1] = `
#show math.equation: set text(size: 20pt)
#set page(height: auto, width: auto, margin: 0pt)

$ ${code} $
`;

  templates[2] = `
#set text(size: 20pt)
#set page(height: auto, width: auto, margin: 0pt)

${code}
`;

  const mainContent = templates[displayMode]

  let svg;
  try {
    svg = await $typst.svg({mainContent});
  } catch (err) {
    console.error(err)
    return {
      ok: false,
      vNode: htmlToVNode(code),
    }
  }
  svg = svg.replace(/xmlns(:\w+)?="[^"]*"/g, '');
  svg = svg.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const vnode = htmlToVNode(svg)[0]
  replaceSlashInAttrs(vnode)
  return {
    ok: true,
    vNode: vnode
  }
}

