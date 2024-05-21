# PlanOfSafeCare Frontend Repository

## Overview

The frontend is built using React, Vite, Tailwind, and Typescript

## Install and Run

To install and run locally:

- Install all packages with `npm install`
- Run the local server with `npm run dev`

# Documentation

## Custom Tailwind Utilities

### 1. Font Variation Settings

Located in [./fontVariationSettingsPlugin.ts](./fontVariationSettingsPlugin.ts)

Allows variable fonts to be adjusted via Tailwind classes

The classes included are:

| Width Axis Tailwind Class | CSS Property                           |
| ------------------------- | -------------------------------------- |
| ultracondensed            | font-variation-settings: 'wdth' 50;    |
| extracondensed            | font-variation-settings: 'wdth' 62.5;  |
| condensed                 | font-variation-settings: 'wdth' 75;    |
| semicondensed             | font-variation-settings: 'wdth' 87.5;  |
| base                      | font-variation-settings: 'wdth' 100;   |
| semiexpanded              | font-variation-settings: 'wdth' 112.5; |
| expanded                  | font-variation-settings: 'wdth' 125;   |
| extraexpanded             | font-variation-settings: 'wdth' 150;   |
| ultraexpanded             | font-variation-settings: 'wdth' 200;   |

| Weight Axis Tailwind Class | CSS Property                         |
| -------------------------- | ------------------------------------ |
| thin                       | font-variation-settings: 'wght' 100; |
| extraLight                 | font-variation-settings: 'wght' 200; |
| light                      | font-variation-settings: 'wght' 300; |
| normal                     | font-variation-settings: 'wght' 400; |
| medium                     | font-variation-settings: 'wght' 500; |
| semibold                   | font-variation-settings: 'wght' 600; |
| bold                       | font-variation-settings: 'wght' 700; |
| extrabold                  | font-variation-settings: 'wght' 800; |
| black                      | font-variation-settings: 'wght' 900; |

| Slant Axis Tailwind Class | CSS Property                       |
| ------------------------- | ---------------------------------- |
| italic                    | font-variation-settings: 'slnt' 1; |
| not-italic                | font-style: normal;                |
