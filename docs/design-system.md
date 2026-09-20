# EduPath — Design System Specification

EduPath rejects modern generic web SaaS cliches (lavender gradients, pill badges, bloated rounded cards, glassmorphic blur). Instead, it implements **Editorial Tech Brutalism + Swiss / International Modernism**:

```
+-------------------------------------------------------------------------+
| FIG. 01 / SKILL SYSTEM                                     SYS.STATUS   |
| [============================= 84% ========================] VERIFIED  |
|                                                                         |
| 1px HAIRLINE BORDER     | MONOSPACE METRICS       | HIGH CONTRAST INK  |
+-------------------------------------------------------------------------+
```

---

## 1. Core Color Palette

| Token | Hex | Role & Usage |
|---|---|---|
| `--bg-paper` | `#F9F9F8` | Warm, non-fatiguing off-white paper canvas |
| `--bg-surface` | `#FFFFFF` | Primary card and input surface |
| `--border-rule` | `#E5E5E0` | Hairline structural separator and grid border (1px) |
| `--border-dark` | `#111111` | High-emphasis brutalist focus border & hard drop shadow |
| `--text-ink` | `#111111` | Near-black typographic text color for maximum legibility |
| `--text-muted` | `#666666` | Secondary labels, timestamps, metadata |
| `--accent-blue` | `#0D52FF` | Single electric blue accent used exclusively for primary actions & key highlights |
| `--accent-blue-hover` | `#0043E0` | Interactive active state for primary buttons |
| `--status-verified` | `#16A34A` | Verified evidence green |
| `--status-progress` | `#D97706` | In-progress gap amber |
| `--status-critical` | `#DC2626` | Critical gap blocking promotion |

---

## 2. Typography Rules

1. **Editorial Serif (`Space Grotesk` / `Playfair` / `Newsreader`)**:
   - Used exclusively for major page headlines, hero manifestos, and challenge titles.
   - Conveys authority, publishing precision, and academic credibility.
2. **Body Sans (`Inter`)**:
   - Crisp, neutral grotesque sans-serif for descriptions, paragraphs, and forms.
   - Clean spacing with `leading-relaxed` (1.6x line height).
3. **Monospace (`JetBrains Mono`)**:
   - Used for structural metadata: `FIG. 01`, `TIMESTAMP`, status chips, percentages, and telemetry.
   - Uppercase tracking (`tracking-wider`, `text-[11px]`).

---

## 3. Structural Rules & Borders

- **Border Width**: Strictly 1px hairline rules (`border border-rule` or `border border-dark`).
- **Corner Radii**: Strictly sharp or micro-radius (`rounded-none` or `rounded-sm`). No circular pill shapes.
- **Hard Shadows**: Elevated cards use sharp brutalist offsets: `shadow-[3px_3px_0px_0px_#111111]` or `shadow-[3px_3px_0px_0px_#0D52FF]`.
- **Figure Labeling**: Every major card or section begins with an editorial figure caption:
  `FIG. 01 / SKILL SYSTEM`, `FIG. 02 / CURRENT CAPABILITY MATRIX`.
