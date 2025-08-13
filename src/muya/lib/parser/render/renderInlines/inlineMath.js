import katex from 'katex'
import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/all-in-one-lite.bundle.js'
import 'katex/dist/contrib/mhchem.min.js'
import { CLASS_OR_ID } from '../../../config'
import { htmlToVNode } from '../snabbdom'
import { renderToSVGString } from '../typst'

import 'katex/dist/katex.min.css'

export default function displayMath (h, cursor, block, token, outerClass) {
  const className = this.getClassName(outerClass, block, token, cursor)
  const mathSelector = className === CLASS_OR_ID.AG_HIDE
    ? `span.${className}.${CLASS_OR_ID.AG_MATH}`
    : `span.${CLASS_OR_ID.AG_MATH}`

  const { start, end } = token.range
  const { marker } = token

  const startMarker = this.highlight(h, block, start, start + marker.length, token)
  const endMarker = this.highlight(h, block, end - marker.length, end, token)
  const content = this.highlight(h, block, start + marker.length, end - marker.length, token)

  const { content: math, type } = token

  const { loadMathMap } = this

  const displayMode = false
  const key = `${math}_${type}`
  let mathVnode = null
  let previewSelector = `span.${CLASS_OR_ID.AG_MATH_RENDER}`
  if (loadMathMap.has(key)) {
    mathVnode = loadMathMap.get(key)
  } else {
    console.log("inline math", key)
    this.typstCache.push({
      domKey: `#${block.key}`,
      mathKey: key,
      code: math,
      displayMode: 0
    })
    mathVnode = null
    //console.log("math", math)
    //console.log(`#${block.key}`)
    // renderToSVGString(math, displayMode).then((res) => {
    //   mathVnode = res.vNode
    //   loadMathMap.set(key, mathVnode);
    // });

    // try {
    //   const html = katex.renderToString(math, {
    //     displayMode
    //   })
    //   mathVnode = htmlToVNode(html)
    //   loadMathMap.set(key, mathVnode)
    // } catch (err) {
    //   mathVnode = math
    //   previewSelector += `.${CLASS_OR_ID.AG_MATH_ERROR}`
    // }
  }

  return [
    h(`span.${className}.${CLASS_OR_ID.AG_MATH_MARKER}`, startMarker),
    h(mathSelector, [
      h(`span.${CLASS_OR_ID.AG_INLINE_RULE}.${CLASS_OR_ID.AG_MATH_TEXT}`, {
        attrs: { spellcheck: 'false' }
      }, content),
      h(previewSelector, {
        attrs: { contenteditable: 'false' }
      }, mathVnode)
    ]),
    h(`span.${className}.${CLASS_OR_ID.AG_MATH_MARKER}`, endMarker)
  ]
}
