# Menu Capture Form Templates

LaTeX templates for standardized menu documentation and quality control in the Elements dining program.

## Overview

These forms are designed for capturing dish presentations, plating standards, and quality control feedback during menu cycles.

## Templates

### `elements-week1-monday.tex`

An 8-page interactive PDF form for Monday's menu capture covering:

| Page | Category | Purpose |
|------|----------|---------|
| 1 | Soup du Jour | Daily soup presentation |
| 2 | Market Salad | Salad course documentation |
| 3 | Entrée 1 | Chef's Feature |
| 4 | Entrée 2 | Comfort Classic |
| 5 | Entrée 3 | Lighter/Vegetarian Option |
| 6 | Seasonal Vegetable | Side dish presentation |
| 7 | Signature Starch | Starch accompaniment |
| 8 | Dessert Feature | Dessert presentation |

## Form Fields

Each page includes:

- **Dish Name** - Name of the prepared dish
- **Time of Shot** - When the photo was taken
- **Chef / Plated By** - Staff member responsible
- **Station** - Kitchen station
- **Photo Upload** - Interactive button for image import (Adobe Reader/Acrobat)
- **Quality Control Checklist**:
  - Temperature Correct?
  - Rim Wiped Clean?
  - Fresh Garnish?
- **Critique / Improvements Needed** - Multiline feedback area

## Compilation

Requires XeLaTeX for font support:

```bash
xelatex elements-week1-monday.tex
```

### Dependencies

- `fontspec` - Custom font support (Noto Sans)
- `tcolorbox` - Styled boxes and panels
- `hyperref` - Interactive form fields
- `fancyhdr` - Custom headers/footers

## Customization

### Creating New Week/Day Templates

1. Copy the base template
2. Update header text in `\fancyhead[L]` (e.g., "WEEK 2")
3. Update header text in `\fancyhead[R]` (e.g., "TUESDAY MENU CAPTURE")
4. Modify `\menuPage` calls to reflect different menu items if needed

### Color Scheme

Defined at the top of the document:

```latex
\definecolor{elementsGreen}{RGB}{34, 139, 34}
\definecolor{lightGreen}{RGB}{235, 250, 235}
```

## Integration with Culi.Flow

These templates complement the Culi.Flow StandardsMode plating portfolio workflow by providing:

- Physical capture forms for kitchen use
- Standardized documentation format
- Quality control checklist alignment with compliance requirements
- Evidence collection for audit trail
