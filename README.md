# Tailwind Dark/Light Mode Autofill

## Overview

Tailwind Dark/Light Mode Autofill is a Visual Studio Code extension that streamlines the process of working with Tailwind CSS dark mode classes. It automatically suggests and inserts corresponding light or dark mode classes when you type their counterparts, saving you time and reducing errors in your CSS.

## Features

- Automatically inserts paired Tailwind CSS classes (dark or light mode)
- Supports a wide range of Tailwind color utilities including background, text, border, and more
- Configurable to work with either dark-mode-first or light-mode-first workflows
- Prevents redundant class insertions
- Works with custom color schemes defined in a JSON configuration file
- Dynamic configuration updates without requiring VS Code reload

## Installation

1. Open Visual Studio Code
2. Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on Mac)
3. Search for "Tailwind Dark/Light Mode Autofill"
4. Click Install

## Usage

1. Create a `tailwind-dark-light-mapping.json` file in the root of your project (see Configuration section below)
2. Open a file that uses Tailwind CSS classes (e.g., .html, .jsx, .vue)
3. Start typing a Tailwind class, for example: `bg-lime-200` or `dark:bg-lime-200` depending on if you type your dark or light mode first.
4. The extension will automatically insert the corresponding paired class based on your configuration

## Configuration

Create a `tailwind-dark-light-mapping.json` file in the root of your project with the following structure:

```json
{
    "colors": {
        "lime-200": "lime-800",
        "lime-400": "lime-600",
        // ... more color mappings ...
    },
    "lightModeFirst": false
}
```

- `colors`: An object mapping dark mode colors to light mode colors (or vice versa)
**⚠️ Please note: There is currently a bug with `lightModeFirst: true` and it may not work as expected.**
- `lightModeFirst`: 
  - Set to `true` if you typically write light mode classes first and want dark mode classes added automatically
  - Set to `false` if you typically write dark mode classes first and want light mode classes added automatically

The extension will automatically detect changes to this file and update its behavior accordingly, without requiring a reload of VS Code.

## Supported Color Utilities

The extension supports the following Tailwind color utilities:

- Background (`bg-`)
- Text (`text-`)
- Border (`border-`)
- Ring (`ring-`)
- Divide (`divide-`)
- Placeholder (`placeholder-`)
- From (`from-`)
- Via (`via-`)
- To (`to-`)
- Stroke (`stroke-`)
- Fill (`fill-`)

## Examples

With `"lightModeFirst": false`:
- Typing `dark:bg-lime-800` will automatically add `bg-lime-200`

**⚠️ Please note: There is currently a bug with `lightModeFirst: true` and it may not work as expected.**

With `"lightModeFirst": true`:
- Typing `bg-lime-200` will automatically add `dark:bg-lime-800`


## Feedback and Contributions

We welcome your feedback and contributions! Please visit our [GitHub repository](https://github.com/yourusername/tailwind-dark-light-mode-autofill) to submit issues, feature requests, or pull requests.

## License

This extension is released under the [MIT License](https://opensource.org/licenses/MIT).

## About

Tailwind Dark/Light Mode Autofill is developed and maintained by [Your Name/Company]. For more information, visit [your website or contact information].

Enjoy faster and more consistent dark/light mode styling with Tailwind CSS!