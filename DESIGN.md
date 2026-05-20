# **AUGE Design – Design System Documentation**

This document outlines the core design language, tokens, and component patterns for the AUGE Design website. The design is characterized by its bold, brutalist-inspired typography, high-contrast layouts, and minimalist grid structures that let the agency's work take center stage.

## **1\. Color Palette**

The core palette relies heavily on high-contrast monochromatic tones, punctuated by stark, vibrant background fills for specific narrative sections.

### **Core Tokens (Frequency-Based)**

| Token | Hex Value | Usage / Notes |
| :---- | :---- | :---- |
| **Color 1 (Primary Dark)** | \#000000 | Primary text, footer backgrounds, stark section backgrounds. |
| **Color 2 (Primary Light)** | \#ffffff | Page backgrounds, reversed text on dark/colored backgrounds. |
| **Color 3 (Gray 1\)** | \#b3b3b3 | Secondary text, subtle borders, muted information. |
| **Color 4 (Gray 2\)** | \#aca7a7 | Tertiary text, inactive states. |
| **Color 5 (Gray 3\)** | \#808080 | Image placeholders, deeper borders. |
| **Color 6 (Gray 4\)** | \#c0c0c0 | Hover states, subtle dividers. |
| **Color 7 (Gray 5\)** | \#d6d0d0 | Very light dividers and table borders. |

### **Brand Accent Colors (Visual Reference)**

While the structural UI is predominantly monochrome, large blocks of color are used for editorial impact:

* **Vibrant Red**: Used in the "DON MOLINICO" hero section to demand immediate attention.  
* **Mint Green**: Used in the "WE PAVE OUR OWN WAY." services section for a refreshing, calm contrast.

## **2\. Typography**

The typographic hierarchy is the defining feature of the AUGE website. It uses a mix of a mechanical sans-serif for utility and a massive, heavy typeface for impact, softened occasionally by a classic serif.

### **Font Families**

* **Primary Sans (Utility & Body):** NeueMontreal-Medium  
* **Display / Hero (Impact):** Greed-Bold  
* **Accent Serif (Categories/Metadata):** AUGEFarnhamDisplay-Italic

### **Typographic Tokens**

| Token | Font Family | Size | Weight | Line Height | Tracking | Usage |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Type 1** | NeueMontreal-Medium | 12.54px | 400 | 12.54px | Normal | Standard body text, navigation links, small UI labels. |
| **Type 2** | NeueMontreal-Medium | 15.05px | 400 | 16.55px | \-0.15px | Subheadings, introductory paragraph text, list items. |
| **Type 3** | NeueMontreal-Medium | 12.54px | 400 | 11.28px | Normal | Dense table data, fine print, metadata. |
| **Type 4** | AUGEFarnhamDisplay-Italic | 10.03px | 400 | 10.03px | \-0.05px | Accent tags, project categories (e.g., *Identity, Packaging*). |
| **Type 5** | Greed-Bold | 250.88px | 400 | 200.70px | \-3.76px | Massive hero text, footer logo lockups (e.g., "AUGE", "LATEST NEWS"). |

*Note: Type 5 scales fluidly based on viewport width (vw) to maintain edge-to-edge impact. On mobile viewports, hero typography aggressively scales down using `clamp(3rem, 15vw, 6rem)` to prevent layout breakage while maintaining impact.*

### **Responsive Consistency**
To maintain strict functional consistency across devices (inspired by our Soviet bus stops metaphor):
- **Hero & Headings**: Fluid scaling using CSS `clamp()` (e.g., `--font-size-hero: clamp(3rem, 12vw, 15rem);`).
- **Body & Metadata**: Fixed scaling (`clamp(1rem, 1.2vw, 1.25rem)`) to guarantee readability without overflowing mobile margins.

## **3\. Spacing & Layout**

The spatial system embraces both generous, editorial whitespace and tightly packed, tabular data grids.

### **Spacing Tokens**

* space-1: 38.4px  
* space-2: 12.5px  
* space-3: 6.3px  
* space-4: 12.8px  
* space-5: 5px  
* space-6: 94.1px (Large section gaps)  
* space-7: 37.6px  
* space-8: 28.2px  
* space-9: 16px  
* space-10: 62.7px

### **Layout Principles**

* **Fluid Containers:** Content stretches across a wide, almost edge-to-edge container, with tight margins on the extreme left and right.  
* **Harsh Grid Lines:** Sections like "GOOD IDEAS NEVER GET OLD" (Archive) and "AWARDS" use visible, 1px solid black (or light gray) horizontal lines to separate items, reminiscent of a spreadsheet or brutalist ledger.  
* **Asymmetry:** Project modules and text blocks often use asymmetrical grid placement (e.g., one large image paired with a smaller image, or heavily indented text blocks).

## **4\. Component Patterns**

### **4.1. Navigation**

* Fixed/Sticky at the top.  
* Minimalist: Just the 'A' logo mark on the left, primary links (WORKS, ABOUT, ARCHIVE), and a CTA (GET IN TOUCH) on the right.  
* All caps, using the NeueMontreal utility font.

### **4.2. Project Cards (Work Feed)**

* **Media:** Edge-to-edge photography or video. No rounded corners on main portfolio items.  
* **Caption:** Positioned directly below the media.  
* **Title:** Bold, left-aligned (NeueMontreal).  
* **Category:** Italicized, subtle grey (AUGEFarnhamDisplay-Italic).  
* **Year:** Right-aligned, enclosed in parentheses (e.g., ( 2026 )).

### **4.3. Archive / Data Lists**

* Used for awards and project archives.  
* 100% width rows.  
* Separated by fine \#000000 or \#c0c0c0 top/bottom borders.  
* Data is organized into strict columns (Title, Category, Sector, Year).

### **4.4. Buttons & Links**

* Inline links feature a simple, thin underline or an arrow suffix (e.g., More Works \-\>, Load More ↓).  
* Hover states typically rely on opacity shifts or striking a line through the text, maintaining the raw, unpolished aesthetic.

### **4.5. Footer**

* Characterized by a gigantic, screen-filling implementation of the word "AUGE" using Greed-Bold.  
* Includes minimal legal text, copyright, and social links organized in a strict 4-column sub-grid above the massive logo.

## **5\. Shape & Radii**

The design is overwhelmingly rectilinear, favoring sharp corners to maintain an editorial, print-like feel.

* **radius-1 (100px):** Rarely used, reserved for specific badge elements or circular UI toggles (if any).  
* **radius-2 (4px):** Used sparingly for subtle softening of interactive elements or form fields. Main media assets have 0px border-radius.

## **6\. Animation & Interaction**

The animation style is deliberate, bold, and tightly tied to scroll position, reinforcing the brutalist, editorial aesthetic of the site.

### **6.1. Custom Cursor**

* **Behavior:** The default system cursor is replaced by a persistent, custom black dot (\#000000).  
* **Interaction:** It smoothly follows the mouse pointer, providing a tactile, continuous connection to the interface as the user navigates over stark whitespace and large imagery.

### **6.2. Scroll-Triggered Text Reveals (Masking)**

* **Behavior:** Large typographic headings (e.g., "BOLD DESIGN, ALWAYS IN AUGE.", "INDEPENDENCE. HOW REFRESHING.") do not simply fade in. They use a hard mask reveal technique.  
* **Mechanics:** Text blocks are wrapped in containers with overflow: hidden. The text starts translated vertically downwards (transform: translateY(100%)) and quickly slides up into its container (translateY(0)) as it enters the viewport. This gives the illusion of text rising decisively out of an invisible baseline.

### **6.3. Hero Media Reels**

* **Behavior:** In certain high-impact sections, massive static typography (like the white "AUGE" logo text) is juxtaposed over a rapid-fire sequence of full-screen project images or video clips. This creates a highly dynamic background while maintaining typographic clarity in the foreground.

### **6.4. Snappy Easing**

* **Behavior:** When elements animate in, the easing curves feel sharp and confident (likely an ease-out or custom cubic-bezier) rather than slow or floaty. This matches the mechanical, architectural tone of the typography.