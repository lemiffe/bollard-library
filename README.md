# Bollard Library

Bollard SVG Library (all the bollards in the world!). The purpose of this library is to provide a collection of SVGs of road-side bollards that can be used in your own projects, as well as a simple website where you can explore the bollards of the world.

## Website

- Pending

## Install

You can either the project as a ZIP (see the "releases" tab in Github) or install it via npm:

```bash
npm install --dev bollard-library # TODO
```

## Development

- `npm install`
- `npm start`

To add country IDs to the <svg> tags in the .svg files use:

- `python tools/add-bollard-ids.py`

To check if all countries have bollards, and all bollard SVGs have a country:

- `python tools/countries-json-check.py`

## Credits

- This library was based on the **[flag-icons](https://github.com/lipis/flag-icons)** repository by [lipis](https://github.com/lipis) (used as a starting point before going in a different direction, however the structure for the README and package remain the same, thank you for creating such a great project!)
