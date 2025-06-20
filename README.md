# Vault Stats Plugin for Obsidian

A simple Obsidian plugin that exposes two handy global functions for vault statistics, which you can call from DataviewJS or other scripts:

- `showStats()`: Returns markdown summary of vault note count, word count, links, and tags.
- `showLastModifiedNotes(numItems = 10, excludeFolder = "Templates")`: Returns markdown list of the most recently modified notes, excluding an optional folder.

## Installation

You can grab it from the Obsidian app, Community Plugins section.

1. Clone or download this repo.
2. Build the plugin with `npm install` and `npm run build`.
3. Copy the resulting `main.js`, `manifest.json`, and optionally `styles.css` to your vault plugin folder:

<your-vault>/.obsidian/plugins/vault-stats/

swift
Copy
Edit

4. Enable the plugin in Obsidian's Community Plugins settings.

## Usage

Inside any note, create a DataviewJS block like this:

```dataviewjs
// Show general vault stats
let s = await window.showStats();
dv.paragraph(s);

// Show last modified notes (default 10, excluding "Templates" folder)
let recent = await window.showLastModifiedNotes(10, "Templates");
dv.paragraph("### 🕒 Last Modified Notes:\n\n" + recent);
```

You can customize numItems and excludeFolder arguments for showLastModifiedNotes.

## Development
The main plugin code is in main.ts.

Build with npm run build.

For development, use npm run dev to watch and rebuild on changes.

## License
[MIT License](LICESNE) — feel free to use and modify.
