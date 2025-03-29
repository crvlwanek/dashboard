import fs from "fs"

const WHITE = "#FFF"
const BLACK = "#000"

const colors = [
  { name: "surface", light: WHITE, dark: "#222222" },
  { name: "onSurface", light: "#1b1717", dark: WHITE },
  { name: "surface-alpha-800", light: "rgba(255, 255, 255, 0.8)", dark: "rgba(34, 34, 34, 0.8)" },
  { name: "surface-alpha-600", light: "rgba(255, 255, 255, 0.6)", dark: "rgba(34, 34, 34, 0.6)" },
  { name: "surfaceVariant", light: "#EEE", dark: "#333" },
  { name: "onSurfaceVariant", light: "#1b1717", dark: WHITE },
  { name: "hoverHighlight", light: BLACK, dark: WHITE },
  { name: "hoverHighlightAlpha", light: "rgba(0, 0, 0, 0.1)", dark: "rgba(255, 255, 255, 0.1)" },
  { name: "hoverHighlightAlpha200", light: "rgba(0, 0, 0, 0.2)", dark: "rgba(255, 255, 255, 0.2)" },
  { name: "surfaceBg", light: "#f1f1f1", dark: "#181818" },
  { name: "labelText", light: "#999", dark: "#777" },
  { name: "deempText", light: "#666", dark: "#aaa" },
  { name: "orange-bg", light: "#fed7aa", dark: "#9a3412" },
  { name: "green-bg", light: "#bbf7d0", dark: "#166534" },
  { name: "purple-bg", light: "#e9d5ff", dark: "#6b21a8" },
]

function assert(value, errorMessage) {
  if (!value) throw new Error(errorMessage)
}

class CSSBuilder {
  __indentationIncrement = 2

  constructor() {
    this._strings = []
    this._indentation = 0
  }

  append(str) {
    this._strings.push(str)
    return this
  }

  toString() {
    return this._strings.join("")
  }

  newline() {
    return this.append("\n")
  }

  _incrementIndentation() {
    this._indentation += this.__indentationIncrement
    assert(
      this._indentation % this.__indentationIncrement === 0,
      "Indentation not divisible by increment"
    )
    return this
  }
  _decrementIndentation() {
    this._indentation -= this.__indentationIncrement
    assert(this._indentation >= 0, "Indentation lower than 0")
    return this
  }

  _addIndentation() {
    if (!this._indentation) return this

    this.append(" ".repeat(this._indentation))
    return this
  }

  _startBrace() {
    return this.append("{")._incrementIndentation().newline()
  }

  _endBrace() {
    return this._decrementIndentation()._addIndentation().append("}").newline()
  }

  startSelector(selector) {
    return this._addIndentation().append(selector).append(" ")._startBrace()
  }

  endSelector() {
    return this._endBrace()
  }

  addComment(comment) {
    return this._addIndentation().append(`/** ${comment} */`).newline()
  }

  addProperty(property, value) {
    return this._addIndentation().append(`${property}: ${value};`).newline()
  }
}

const cssBuilder = new CSSBuilder()

cssBuilder.startSelector(":root")

cssBuilder.addComment("Light mode colors")
colors.forEach(color => {
  const { name, light } = color
  if (!name || !light) return

  cssBuilder.addProperty(`--${name}`, light)
})
cssBuilder.newline()

cssBuilder.addComment("Dark mode colors")
colors.forEach(color => {
  const { name, dark } = color
  if (!name || !dark) return

  cssBuilder.addProperty(`--dark-${name}`, dark)
})

cssBuilder.endSelector().newline()

cssBuilder.startSelector('body[theme="dark"]')
colors.forEach(color => {
  const { name } = color
  if (!name) return

  cssBuilder.addProperty(`--${name}`, `var(--dark-${name})`)
})

cssBuilder.endSelector().newline()

cssBuilder.startSelector("@media (prefers-color-scheme: dark)")
cssBuilder.startSelector('body[theme="system"]')
colors.forEach(color => {
  const { name } = color
  if (!name) return

  cssBuilder.addProperty(`--${name}`, `var(--dark-${name})`)
})

cssBuilder.endSelector().endSelector().newline()

cssBuilder.addComment("Color classes")
colors.forEach(color => {
  const { name } = color
  if (!name) return

  cssBuilder.startSelector(`.bg-${name}`)
  cssBuilder.addProperty("background-color", `var(--${name})`)
  cssBuilder.endSelector().newline()
})

fs.writeFile("app/generated.css", cssBuilder.toString(), err => {
  if (!err) return
  console.error(err)
})
