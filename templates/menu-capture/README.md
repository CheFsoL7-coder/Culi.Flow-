# Menu Capture Form Templates

LaTeX templates for standardized menu documentation and quality control in the Elements dining program.

## 5-Week Menu Cycle Overview

```
[Wk1 🟢][Wk2 🟣][Wk3 🟠][Wk4 🔵][Wk5 🟡]

[SOUP]    |🍲|
[SALAD]   |🥗|
[ENTRÉE]  1|🥘|  2|🧆|  3|🍱|
[VEG]     1|🥕|  2|🌽|
[STARCH]  1|🥔|  2|🍚|
[DESSERT] |🍮|
```

## Template Files

### Master Template (Configurable)

**`elements-master-template.tex`** - Single configurable template for any week/day combination.

Edit these variables at the top of the file:
```latex
\newcommand{\WeekNumber}{1}    % 1-5
\newcommand{\DayName}{MONDAY}  % MONDAY, TUESDAY, etc.
```

### Pre-configured Week Templates

| File | Week | Color | Emoji |
|------|------|-------|-------|
| `week1-green.tex` | Week 1 | Green (#228B22) | 🟢 |
| `week2-purple.tex` | Week 2 | Purple (#800080) | 🟣 |
| `week3-orange.tex` | Week 3 | Orange (#FF8C00) | 🟠 |
| `week4-blue.tex` | Week 4 | Blue (#1E5AB4) | 🔵 |
| `week5-yellow.tex` | Week 5 | Gold (#DAA520) | 🟡 |

Each week template includes 10 menu item pages:

| Page | Category | Emoji |
|------|----------|-------|
| 1 | Soup du Jour | 🍲 |
| 2 | Market Salad | 🥗 |
| 3 | Entrée 1 (Chef's Feature) | 🥘 |
| 4 | Entrée 2 (Comfort Classic) | 🧆 |
| 5 | Entrée 3 (Lighter Option) | 🍱 |
| 6 | Vegetable 1 | 🥕 |
| 7 | Vegetable 2 | 🌽 |
| 8 | Starch 1 | 🥔 |
| 9 | Starch 2 | 🍚 |
| 10 | Dessert Feature | 🍮 |

## Form Fields (Each Page)

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
# Compile a single template
xelatex week1-green.tex

# Compile master template
xelatex elements-master-template.tex

# Batch compile all weeks
for week in week*.tex; do xelatex "$week"; done
```

### Dependencies

- `fontspec` - Custom font support (Noto Sans)
- `tcolorbox` - Styled boxes and panels
- `hyperref` - Interactive form fields
- `fancyhdr` - Custom headers/footers
- `ifthen` - Conditional logic (master template only)

## Customization

### Changing the Day

In each week template, edit the `\DayName` command:
```latex
\newcommand{\DayName}{TUESDAY}  % Change to desired day
```

### Color Schemes

Week colors are defined per file. To customize:
```latex
\definecolor{weekColor}{RGB}{34, 139, 34}        % Primary color
\definecolor{weekColorLight}{RGB}{235, 250, 235} % Background tint
```

## Digital Integration (Culi.Flow)

These templates integrate with the **Menu Cycle Tracker** in Culi.Flow (`/menu-cycle`):

### Digital Features
- **Week/Day Selection** - Navigate 5-week cycle with color-coded UI
- **Per-Item Capture** - Track dish name, chef, station, quality checks
- **Google Photos Integration** - Link album URLs per day
- **Import/Export** - JSON backup and restore
- **Completion Tracking** - Progress statistics per week

### Workflow
1. **Physical Capture** - Print PDF forms for binder/kitchen use
2. **Digital Entry** - Enter data in Culi.Flow Menu Cycle Tracker
3. **Photo Album** - Link Google Photos albums for each day
4. **Audit Trail** - Export JSON for compliance records

## File Structure

```
templates/menu-capture/
├── README.md                    # This file
├── elements-master-template.tex # Configurable master template
├── elements-week1-monday.tex    # Original template (deprecated)
├── week1-green.tex              # Week 1 - Green 🟢
├── week2-purple.tex             # Week 2 - Purple 🟣
├── week3-orange.tex             # Week 3 - Orange 🟠
├── week4-blue.tex               # Week 4 - Blue 🔵
└── week5-yellow.tex             # Week 5 - Gold 🟡
```

## Quick Reference

| Week | Color | RGB | Light BG |
|------|-------|-----|----------|
| 1 | Green | 34, 139, 34 | 235, 250, 235 |
| 2 | Purple | 128, 0, 128 | 245, 235, 250 |
| 3 | Orange | 255, 140, 0 | 255, 245, 235 |
| 4 | Blue | 30, 90, 180 | 235, 245, 255 |
| 5 | Gold | 218, 165, 32 | 255, 250, 235 |
