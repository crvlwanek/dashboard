import fs from "fs"

const WHITE = "#FFF"
const BLACK = "#000"

function color(name, light, dark) {
  return { name, light, dark }
}

function rgba(r, g, b, a) {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const colors = [
  color("primary", "hsl(178, 100%, 53%)", "hsl(178, 100%, 40%)"),
  color("surface", WHITE, "#222222"),
  color("onSurface", "#1b1717", WHITE),
  color("surface-alpha-800", rgba(255, 255, 255, 0.8), rgba(34, 34, 34, 0.8)),
  color("surface-alpha-600", rgba(255, 255, 255, 0.6), rgba(34, 34, 34, 0.6)),
  color("surfaceVariant", "#EEE", "#333"),
  color("onSurfaceVariant", "#1b1717", WHITE),
  color("hoverHighlight", BLACK, WHITE),
  color("hoverHighlightAlpha", rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.1)),
  color("hoverHighlightAlpha200", rgba(0, 0, 0, 0.2), rgba(255, 255, 255, 0.2)),
  color("surfaceBg", "#f1f1f1", "#181818"),
  color("labelText", "#999", "#777"),
  color("deempText", "#666", "#aaa"),
  color("orange-bg", "#fed7aa", "#9a3412"),
  color("green-bg", "#bbf7d0", "#166534"),
  color("purple-bg", "#e9d5ff", "#6b21a8"),
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

  addImport(file) {
    return this.append(`@import "${file}";`)
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

cssBuilder.addImport("tailwind.css").newline().newline()
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

colors.forEach(color => {
  const { name } = color
  if (!name) return

  cssBuilder.startSelector(`.bg-${name}`)
  cssBuilder.addProperty("background-color", `var(--${name})`)
  cssBuilder.endSelector()
})

fs.writeFile("app/generated.css", cssBuilder.toString(), err => {
  if (!err) return
  console.error(err)
})
