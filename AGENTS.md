# AGENTS.md

# Fabrico

Fabrico is a premium clothing e-commerce platform focused on product customization.

Users can:

- Browse clothing products
- View product details
- Customize apparel in real-time
- Order online
- Pay with Cash on Delivery or Online Payment (later)

The overall experience should feel modern, premium, minimal, and production-ready.

---

# Tech Stack

Always use:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js
- React Three Fiber
- Drei
- Fabric.js

Never introduce unnecessary libraries without being asked.

---

# Development Philosophy

Write production-quality code.

Prefer readability over cleverness.

Avoid overengineering.

Always write scalable and maintainable code.

Keep components reusable.

Use strict TypeScript.

No `any` unless absolutely unavoidable.

Always prefer composition over inheritance.

---

# Folder Structure

Every route owns its own components.

Example:

app/shop/
    page.tsx
    components/
        ProductGrid.tsx
        ProductCard.tsx
        FilterSidebar.tsx

Do NOT place page-specific components inside the global components folder.

Only shared components belong in:

src/components/

Examples:

- Navbar
- Footer
- Button
- Modal
- Dialog
- Input
- Badge
- Empty State
- Skeleton
- Loading Spinner

---

# Component Rules

Every component should:

- Have a single responsibility
- Be reusable when appropriate
- Be responsive
- Be accessible
- Use semantic HTML

Split components when they become too large.

Avoid components larger than approximately 200 lines.

Prefer small focused components.

---

# Naming Convention

Use PascalCase.

Good:

ProductCard.tsx

HeroSection.tsx

ColorPicker.tsx

Avoid:

card.tsx

hero.tsx

Component1.tsx

---

# Styling

Use Tailwind CSS.

Avoid inline styles.

Avoid arbitrary values unless necessary.

Use spacing consistently.

Prefer:

gap-6

py-16

px-6

max-w-7xl

mx-auto

Avoid inconsistent spacing.

---

# Design Language

Inspired by:

- Apple
- Nike
- Vercel
- Linear
- Raycast

Design principles:

- Premium
- Minimal
- Spacious
- Elegant
- Clean
- Modern

Use generous whitespace.

Avoid visual clutter.

Avoid unnecessary borders.

Use subtle shadows only when appropriate.

Use rounded corners consistently.

Preferred radius:

rounded-xl

rounded-2xl

---

# Typography

Use clear hierarchy.

Headings should feel bold and confident.

Body text should prioritize readability.

Avoid excessive font sizes.

Prefer:

Hero

text-5xl
font-bold

Section Heading

text-3xl

Card Title

text-xl

Body

text-base

Caption

text-sm

---

# Color Philosophy

Use mostly neutral colors.

Primary focus should remain on products.

Use one accent color consistently.

Avoid rainbow gradients.

Avoid excessive colorful UI.

---

# Layout

Always center content.

Prefer:

max-w-7xl

mx-auto

px-6

lg:px-8

Maintain generous vertical spacing.

Every section should breathe.

---

# Responsive Design

Desktop-first thinking.

Then ensure:

Tablet

Mobile

Never ignore small screens.

Avoid horizontal scrolling.

---

# Accessibility

Always:

Use semantic HTML

Use button elements for actions

Use labels for inputs

Provide alt text

Maintain keyboard accessibility

Maintain sufficient contrast

---

# Animation

Use Framer Motion.

Animations should feel premium.

Maximum duration:

300ms

Preferred animations:

- Fade
- Scale
- Blur Reveal
- Stagger
- Hover Lift
- Smooth Page Transition

Avoid:

Bounce

Elastic

Spinning

Long animations

Flashy motion

Animations should enhance UX, not distract.

---

# Icons

Use Lucide React.

Keep icon sizes consistent.

Usually:

w-5 h-5

or

w-6 h-6

---

# Images

Use Next.js Image component whenever possible.

Optimize images.

Never stretch images.

Maintain aspect ratio.

---

# Buttons

Buttons should always have:

Hover state

Focus state

Disabled state

Loading state when appropriate

Maintain consistent sizing.

---

# Forms

Use:

React Hook Form

Zod

Show validation messages.

Never rely only on placeholder text.

Always provide labels.

---

# Performance

Prefer Server Components whenever possible.

Use Client Components only when necessary.

Lazy load heavy sections.

Optimize images.

Avoid unnecessary rerenders.

Memoize only when beneficial.

Avoid premature optimization.

---

# Three.js

Keep rendering performant.

Avoid unnecessary renders.

Use proper lighting.

Use realistic shadows.

Use OrbitControls only where appropriate.

Keep materials physically accurate.

---

# Fabric.js

Keep canvas state clean.

Separate editor logic from UI.

Toolbar should remain modular.

Support:

Text

Images

Color

Scaling

Rotation

Layers

Future extensibility is important.

---

# Code Quality

Avoid duplication.

Extract reusable logic.

Keep functions small.

Use descriptive variable names.

Avoid magic numbers.

Use constants where appropriate.

---

# Error Handling

Always handle:

Loading

Empty states

Errors

Fallback UI

Never leave blank screens.

---

# Comments

Avoid unnecessary comments.

Write self-explanatory code.

Only comment complex business logic.

---

# AI Behavior

When generating code:

Think like a senior frontend engineer.

Prefer production-quality implementations.

Do not generate placeholder-quality UI.

Do not generate generic templates.

If design decisions are unclear:

Choose the most elegant and modern solution.

Always prioritize:

UX

Readability

Maintainability

Performance

Accessibility

Scalability

Consistency.
