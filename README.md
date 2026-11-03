# Pierre Louw — Game Development Portfolio

A responsive portfolio for **https://fate2664.github.io/**, built with HTML, CSS and JavaScript. No dependencies or build step are needed.

## Publish with GitHub Pages

In this repository, open **Settings → Pages**. Under Build and deployment, choose **Deploy from a branch**, then **main** and **/ (root)**, and save. GitHub serves the site over HTTPS and republishes when changes are committed.

## Contents

- `index.html`: introduction, project cards, about and contact sections.
- `projects/dash-drive.html` and `projects/coreline.html`: continuous, Behance-style project galleries. Each has section navigation, artwork expansion, a progress line, and an accessible text view.
- `assets/css/styles.css`: colours, layout, responsive rules, typography and motion.
- `assets/js/site.js`: navigation, scroll reveals, controller interaction and motion preferences.
- `assets/js/project.js`: gallery navigation, text view and optional animated media.
- `assets/js/media.js`: the editable configuration for GIF/video replacements.
- `assets/projects/`: optimised artwork sections, rendered directly from the supplied PDFs at their original 1400-pixel width, and extracted text metadata.
- `assets/images/`: supplied thumbnails, gameplay stills and the portfolio favicon.

The page uses League Spartan for headings and Montserrat for body text, loaded from Google Fonts with system fallbacks. Lilita One remains part of the supplied Coreline artwork.

## Add the two GIF pages

The Coreline PDF has empty media in its cover and robot showcase sections. These currently use stills taken from the supplied materials. To replace these complete sections with your animated versions:

1. Add your GIF files to `assets/media/coreline/`. For example: `cover.gif` and `robots.gif`.
2. Edit `assets/js/media.js`:

```js
window.PROJECT_MEDIA = {
  coreline: {
    'section-01': {
      src: 'assets/media/coreline/cover.gif',
      type: 'image',
      alt: 'Coreline introduction with animated gameplay'
    },
    'section-05': {
      src: 'assets/media/coreline/robots.gif',
      type: 'image',
      alt: 'Mining, collection and scanning robots in action'
    }
  },
  'dash-drive': {}
};
```

These are **whole artwork sections**, not individual inset frames. Export the animated pages at the original proportions: cover **1400 × 950**, robots **1400 × 1600**. If your animated pages belong elsewhere, use the relevant section ID below. For a GIF of just an inset frame, its overlay image can instead be replaced in `projects/coreline.html`.

MP4/WebM also work: set `type: 'video'` and use the video file's path. Videos play muted and loop, with playback controls. They pause off-screen and when the tab is hidden. The footer's **Pause motion** button and the visitor's reduced-motion preference restore the original still artwork. A missing or invalid replacement keeps the original section visible.

All paths in `media.js` are relative to the website root. Leaving `src` empty uses the default artwork. Nothing needs uploading through a visitor-facing admin page; changes are made in this repository.

### Coreline section IDs

| ID | Section |
|---|---|
| `section-01` | Cover |
| `section-02` | Project overview |
| `section-03` | Core gameplay loop |
| `section-04` | Natural language becomes gameplay |
| `section-05` | The robots |
| `section-06` | Command & observe |
| `section-07` | Crafting & progression |
| `section-08` | Programming contribution |
| `section-09` | The future |
| `section-10` | Thanks for viewing |

### Dash Drive section IDs

| ID | Section |
|---|---|
| `section-01` | Cover |
| `section-02` | Project overview |
| `section-03` | Core gameplay |
| `section-04` | Two environments |
| `section-05` | Boss encounters |
| `section-06` | Player controls & world spawning |
| `section-07` | Traffic & boss systems |
| `section-08` | UI & settings |
| `section-09` | Learning Unity |
| `section-10` | The future |
| `section-11` | Thanks for viewing |

## Local preview

From the repository directory:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`. No package installation is required.

## Editing

Update biography/contact copy in `index.html`. Project pages use the source PDF artwork unchanged, apart from separate still overlays in Coreline's empty media frames. Edit the artwork files to update the visual case studies, and keep their corresponding text in `.section-copy` and `sections.json` in sync.

The homepage graphics are SVG/CSS, so colours and animations remain editable. Colours are CSS custom properties at the start of `styles.css`.

The contact section links to the public GitHub profile. The site has no tracking scripts, backend or contact-form service.
