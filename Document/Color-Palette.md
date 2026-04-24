# EduPanel Color Palette

## Overview
The EduPanel homepage uses a warm, welcoming color scheme combining **amber** (warmth and energy) and **teal** (calm and trust) with neutral **stone** tones for balance. This palette creates an inviting, professional design that appeals to educators.

---

## Primary Colors

### Amber (Warm, Action-Oriented)
Used for primary CTAs, accents, and highlighting important actions.

| Shade | Usage | Tailwind Class |
|-------|-------|---|
| Amber-50 | Background gradients, subtle fills | `bg-amber-50` |
| Amber-100 | Badge backgrounds, light accents | `bg-amber-100`, `text-amber-100` |
| Amber-200 | Primary button background | `bg-amber-200` |
| Amber-300 | Button hover state, borders, gradient stops | `hover:bg-amber-300`, `border-amber-300` |
| Amber-500 | Progress bars, gradients | `bg-amber-500` (in gradients) |
| Amber-600 | Text accents, labels | `text-amber-600` |

**Hex Approximations:**
- Amber-50: `#fffbeb`
- Amber-100: `#fef3c7`
- Amber-200: `#fde68a`
- Amber-300: `#fcd34d`
- Amber-500: `#f59e0b`
- Amber-600: `#d97706`

### Teal (Calm, Trust, Progress)
Used for secondary accents, progress indicators, and interactive elements.

| Shade | Usage | Tailwind Class |
|-------|-------|---|
| Teal-50 | Background gradients | `bg-teal-50` |
| Teal-100 | Animated background blobs | `bg-teal-100` |
| Teal-200 | Placeholder bars, light accents | `bg-teal-200` |
| Teal-300 | Gradient stops, hover borders | `from-teal-300`, `hover:border-teal-300` |
| Teal-500 | Progress bars, active states | `bg-teal-500` (in gradients) |
| Teal-600 | Text accents, percentage displays | `text-teal-600` |
| Teal-700 | Logo gradient, dark accents | `from-teal-700` |

**Hex Approximations:**
- Teal-50: `#f0fdfa`
- Teal-100: `#ccfbf1`
- Teal-200: `#99f6e4`
- Teal-300: `#5eead4`
- Teal-500: `#14b8a6`
- Teal-600: `#0d9488`
- Teal-700: `#0f766e`

---

## Neutral Colors

### Stone (Professional, Structural)
Used for borders, backgrounds, and secondary UI elements.

| Shade | Usage | Tailwind Class |
|-------|-------|---|
| Stone-50 | Main page background | `bg-stone-50` |
| Stone-100 | Section backgrounds | `bg-stone-100/85` |
| Stone-200 | Borders, dividers | `border-stone-200`, `border-stone-200/60` |
| Stone-400 | Secondary borders | `border-stone-400` |

**Hex Approximations:**
- Stone-50: `#fafaf9`
- Stone-100: `#f5f5f4`
- Stone-200: `#e7e5e4`
- Stone-400: `#a8a29e`

### Slate (Subtle Accents)
Used for secondary dividers and muted text backgrounds.

| Shade | Usage | Tailwind Class |
|-------|-------|---|
| Slate-200 | Placeholder bars, light dividers | `bg-slate-200` |
| Slate-300 | Progress backgrounds | `bg-slate-300` |

**Hex Approximations:**
- Slate-200: `#e2e8f0`
- Slate-300: `#cbd5e1`

### Cyan (Tertiary Accent)
Used subtly in animated background elements.

| Shade | Usage | Tailwind Class |
|-------|-------|---|
| Cyan-100 | Animated background blob | `bg-cyan-100` |

**Hex Approximations:**
- Cyan-100: `#cffafe`

### White & Black
Core contrast colors for text and backgrounds.

| Color | Usage | Tailwind Class |
|-------|-------|---|
| White | Card backgrounds, button backgrounds | `bg-white` |
| Black | Text content | `text-black` |
| Black/60 | Secondary text | `text-black/60` |
| Black/75 | Tertiary text | `text-black/75` |

---

## Color Usage by Component

### Navigation Bar
- Background: `bg-white/75` with backdrop blur
- Border: `border-stone-200/60`
- Logo gradient: `from-teal-700 to-amber-500`
- Login button: `bg-amber-200 hover:bg-amber-300`

### Hero Section
- Background: `bg-gradient-to-b from-stone-50 via-amber-50 to-teal-50`
- Campaign tag: `bg-amber-100`
- Primary CTA: `bg-amber-200 hover:bg-amber-300`
- Secondary CTA: `border-amber-300 hover:border-amber-500 hover:bg-amber-50`
- Card label: `text-amber-600`
- Progress bar: `from-teal-500 to-amber-500`
- Progress text: `text-teal-600`

### Stats Section
- Background: `bg-gradient-to-r from-stone-100 via-amber-50 to-teal-100`
- Text: `text-black`

### Problems Section
- Cards: `border-stone-200 hover:border-teal-300`
- Background: White with hover shadow

### Features Section
- Background: `bg-stone-100/85`
- Cards: `border-stone-200` white background

### Campaign Examples Section
- Container: `bg-gradient-to-r from-amber-50 to-teal-50`
- Border: `border-amber-200`
- Badges: `border-amber-100 hover:border-teal-300`

### Benefits Section
- Background: `bg-gradient-to-r from-stone-100 via-amber-50 to-stone-200`
- Number indicators: `text-black` (bold, 4xl)

### CTA Section
- Background: `bg-gradient-to-r from-amber-100 via-stone-50 to-teal-100`
- Buttons: White with hover states

### Footer
- Background: `bg-stone-50/80`
- Border: `border-stone-200`

---

## Animated Elements

### Background Blobs
Three animated blobs create depth and movement:

1. **Teal Blob** (top-left)
   - Color: `bg-teal-100` at `opacity-25`
   - Blend mode: `mix-blend-multiply`
   - Filter: `blur-3xl`

2. **Amber Blob** (bottom-right)
   - Color: `bg-amber-100` at `opacity-25`
   - Blend mode: `mix-blend-multiply`
   - Filter: `blur-3xl`
   - Animation delay: `animation-delay-2000`

3. **Cyan Blob** (center)
   - Color: `bg-cyan-100` at `opacity-20`
   - Blend mode: `mix-blend-multiply`
   - Filter: `blur-3xl`
   - Animation delay: `animation-delay-4000`

---

## Gradient Patterns

### Hero Background Gradient
```
bg-gradient-to-b from-stone-50 via-amber-50 to-teal-50
```
Creates a subtle transition from neutral → warm → cool.

### Card Glow Gradient
```
bg-gradient-to-r from-teal-300 to-amber-300
```
Used as background blur for card shadows (opacity-25).

### Progress Bar Gradient
```
bg-gradient-to-r from-teal-500 to-amber-500
```
Combines both primary colors for visual interest.

### Logo Gradient
```
bg-gradient-to-br from-teal-700 to-amber-500
```
Bold diagonal gradient for brand mark.

---

## Accessibility Notes

- **Contrast Ratios**: All text meets WCAG AA standards (black on white/light backgrounds)
- **Color Blind Friendly**: Amber and teal differ in hue, saturation, and lightness—not just by hue
- **Secondary Indicators**: Progress bars use both color and percentage text labels
- **Focus States**: Hover states provide sufficient contrast for interactive elements

---

## Best Practices

1. **Primary Actions**: Use Amber-200/300 for main CTAs (Explore Features, View Demo)
2. **Secondary Actions**: Use bordered styles with Amber-300 or Stone-400 borders
3. **Progress/Status**: Use Teal for completion, progress, and positive states
4. **Neutrality**: Use Stone for structural elements, cards, and dividers
5. **Emphasis**: Use Amber-600 or Teal-600 for text accents
6. **Backgrounds**: Layer subtle gradients (Stone → Amber → Teal) for depth

---

## Color Combinations

### Recommended Pairings
| Foreground | Background | Use Case |
|-----------|-----------|---|
| Black text | Amber-100 | Badges, tags |
| Black text | Teal-200 | Skeleton loaders |
| White text | Teal-700 | Logo, dark CTAs |
| Black text | White | Primary content |
| Teal-600 text | White | Progress labels |
| Amber-600 text | White | Section labels |

---

## File Reference
This color palette is applied consistently across:
- `app/homepage.tsx` - Landing page
- `app/components/*` - Reusable UI components
- `app/(dashboard)/*` - Dashboard pages
- Dashboard data visualization components

