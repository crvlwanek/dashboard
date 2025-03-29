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

class StringBuilder {
  constructor() {
    this.strings = []
  }

  append(str) {
    this.strings.push(str)
    return this
  }

  toString() {
    return this.strings.join("")
  }

  newline() {
    this.strings.push("\n")
    return this
  }
}

const fileStringBuilder = new StringBuilder()

fileStringBuilder.append(":root {").newline()
fileStringBuilder.append("  /** Light mode colors */").newline()

colors.forEach(color => {
  const { name, light } = color
  if (!name || !light) return

  fileStringBuilder.append(`  --${name}: ${light};`).newline()
})

fileStringBuilder.newline()

fileStringBuilder.append("  /** Dark mode colors */").newline()
colors.forEach(color => {
  const { name, dark } = color
  if (!name || !dark) return

  fileStringBuilder.append(`  --dark-${name}: ${dark};`).newline()
})

fileStringBuilder.append("}").newline().newline()

fileStringBuilder.append('body[theme="dark"] {').newline()
colors.forEach(color => {
  const { name } = color
  if (!name) return

  fileStringBuilder.append(`  --${name}: var(--dark-${name});`).newline()
})
fileStringBuilder.append("}").newline().newline()

fileStringBuilder.append("@media (prefers-color-scheme: dark) {").newline()
fileStringBuilder.append('  body[theme="system"] {').newline()

colors.forEach(color => {
  const { name } = color
  if (!name) return

  fileStringBuilder.append(`    --${name}: var(--dark-${name});`).newline()
})

fileStringBuilder.append("  }").newline()
fileStringBuilder.append("}").newline().newline()

fileStringBuilder.append("/** Color classes */").newline()
colors.forEach(color => {
  const { name } = color
  if (!name) return

  fileStringBuilder.append(`.bg-${name} {`).newline()
  fileStringBuilder.append(`  background-color: var(--${name});`).newline()
  fileStringBuilder.append(`}`).newline().newline()
})

fs.writeFile("app/generated.css", fileStringBuilder.toString(), err => {
  if (!err) return
  console.error(err)
})
