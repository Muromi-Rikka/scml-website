# Example Mod Tutorial

This tutorial walks through building a functional Mod from scratch: boot.json, twee passages, JS, CSS, images, packaging, and testing.

## Goal

Create a Mod named `HelloMod` that:

- Adds a custom Passage showing a welcome message
- Styles it with CSS
- Adds a simple macro or function via JS
- Optionally replaces a game image

## Step 1: Project Structure

Create this layout (`HelloMod_Image` is optional, for images):

```tree
HelloMod
├── boot.json
├── readme.txt
├── HelloMod_style.css
├── HelloMod_script.js
├── HelloMod_passage.twee
└── HelloMod_Image
    └── character
        └── avatar.png
```

## Step 2: boot.json

In `HelloMod/boot.json`:

```json
{
  "name": "HelloMod",
  "nickName": "Example Mod",
  "version": "1.0.0",
  "styleFileList": ["HelloMod_style.css"],
  "scriptFileList": ["HelloMod_script.js"],
  "tweeFileList": ["HelloMod_passage.twee"],
  "imgFileList": [],
  "additionFile": ["readme.txt"]
}
```

If you add images, include them in `imgFileList`, e.g.:

```json
"imgFileList": ["HelloMod_Image/character/avatar.png"]
```

## Step 3: Twee Passage

In `HelloMod_passage.twee`, add a Passage:

```text
:: HelloMod Welcome [passage]
HelloMod loaded successfully!
This is custom Passage content.
```

To link to it from another Passage:

```
[[Go to HelloMod Welcome->HelloMod Welcome]]
```

## Step 4: CSS Styles

In `HelloMod_style.css`:

```css
/* HelloMod styles */
#passages .passage[data-passage="HelloMod Welcome"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1em;
  border-radius: 8px;
}
```

## Step 5: JS Script

In `HelloMod_script.js` you can add SugarCube macros or global functions. Example: a simple macro that logs the Mod name and outputs text:

```js
// Use SugarCube Macro API
Macro.add("helloMod", {
  handler() {
    const text = this.args[0] || "HelloMod loaded!";
    $(document.createElement("span")).wiki(text).appendTo(this.output);
  }
});
```

In Twee: `<<helloMod "custom text">>`

## Step 6: readme.txt

In `readme.txt`, add Mod description; the Mod manager shows it:

```
HelloMod - Example Mod
Version 1.0.0

An example Mod demonstrating ModLoader functionality.
```

## Step 7: Packaging

### Manual

1. Select `boot.json` and all referenced files (HelloMod_style.css, HelloMod_script.js, HelloMod_passage.twee, readme.txt, etc.)
2. Compress as Zip (e.g. with 7-Zip)
3. Ensure `boot.json` is at zip root and paths match boot.json
4. Rename to `HelloMod.mod.zip`

### Automated (Node.js)

From the HelloMod directory:

```bash
node "<path to packModZip.js>" "boot.json"
```

Output: `HelloMod.mod.zip`.

## Step 8: Testing

1. Open a game that includes ModLoader (e.g. DoL)
2. Upload or load `HelloMod.mod.zip` in the Mod manager
3. Enable HelloMod and refresh the game
4. In-game, follow the link or use the macro to verify

## Common Issues

### boot.json not at zip root

Make sure you select the files themselves, not the `HelloMod` folder. Wrong: `HelloMod.mod.zip/HelloMod/boot.json`; correct: `HelloMod.mod.zip/boot.json`.

### Path mismatch

Paths in `boot.json` (`styleFileList`, `scriptFileList`, etc.) must exactly match the zip layout, including case.

### Mod not loading

Check the Mod manager load log to see if the Mod was skipped (e.g. dependency failure). If it depends on other Mods, declare them in `boot.json`’s `dependenceInfo`.
