# King of Koolers — 60-Second Hero Sizzle Reel Plan & AI Prompt Pack
**First-Visit Landing Page Video Architecture (6 Scenes × 10 Seconds = 60 Seconds)**
*Target Placement: Top-of-Page Hero Intro (`index.html`) | Export File Target: `./assets/videos/hero_sizzle_reel_60s.mp4`*

---

## 1. Recommended Production Workflow (Why Start-Frame Image Prompts Matter First)

Because AI text-to-video models almost always hallucinate a generic **rectangular Yeti/Igloo chest cooler**, DO NOT send raw text alone straight to a video generator. Use a **two-step Image-to-Video workflow** anchored to your master sheet:

1. **Step 1 — Generate the 6 Start-Frame Keyframe Images (16:9)**:
   Feed [king_of_koolers_character_reference_sheet.jpg](file:///e:/Documents/AiPrograms/KingOfKoolers/assets/images/king_of_koolers_character_reference_sheet.jpg) as your style/geometry reference image + each **Start-Frame Image Prompt** below (works in Nano Banana / Gemini Image, Midjourney `--cref`, Flux, or Runway Frames).
2. **Step 2 — Animate Each Keyframe into a 10-Second Video Clip**:
   Upload each approved 16:9 keyframe image into **Veo 3, Runway Gen-4, Kling 2.x, Sora, or Luma Ray** and paste its matching **10-Second Video Motion Prompt**.
3. **Step 3 — Assemble & Encode (`assets/videos/hero_sizzle_reel_60s.mp4`)**:
   Stitch the six 10-second clips with crisp `0.25s` cross-dissolves/whip cuts, upbeat driving bass percussion, and minimal Apple-style white lower-third callouts (`SF Pro Display`), compressed to **1080p H.264 `.mp4` (~12–18 MB)** so it works inside `KingOfKoolers_Email_Package.zip` and loads instantaneously on GitHub Pages.

---

## 2. How It Plays Automatically on First Visit (`index.html`)

To guarantee the 60-second hero sizzle reel plays immediately when someone runs `index.html` for the first time (without triggering browser autoplay blocks):

1. **First-Visit Cinema Overlay (`localStorage.getItem('kok_intro_seen')`)**:
   - On a user's **very first visit**, `index.html` opens a sleek edge-to-edge full-screen cinema stage playing `hero_sizzle_reel_60s.mp4` automatically (`autoplay muted playsinline`).
   - Top-right/bottom corners include two minimalist glass pill buttons: **`🔊 Unmute Audio`** and **`Skip to Website →`**.
   - At `0:60` (or when `Skip` is clicked), the overlay fades seamlessly into the main Hero Header (`<header class="hero-section">`).
2. **Persistent Hero Header Video Loop**:
   - Inside `<header class="hero-section">`, `.hero-image-frame` displays the **Hero Background Video Loop** (either the full 60s sizzle reel muted on loop, or an instant toggle between **"▶ Watch 60s Launch Film"** and the Patriot RWB hero render).
3. **Return Visits**:
   - Repeat visits skip the full-screen blocker automatically and land straight on the playing Hero Header video (with a **"↺ Replay Launch Film"** pill button nearby).

---

## 3. Master Continuity & Negative Constraint Block (Append to ALL 6 Prompts)

```text
PRODUCT IDENTITY LOCK (KING OF KOOLERS):
Stout, wide 24-inch outer diameter cylindrical rotomolded cooler modules (1:1.1 squat barrel proportions, NOT a tall skinny water jug, NOT a square/rectangular chest cooler). Fine matte micro-stippled UV-resistant rotomolded polyethylene exterior (no high-gloss plastic sheen, no stainless steel drum body). Rigid flat horizontal loop handles molded seamlessly out of opposing sides sticking out horizontally (never vertical side hoops). Flat circular recessed lid sitting completely flush inside the 20-start spiral helix collar rim with a single flush center bar handle or recessed circular 10W solar panel. Zero external front latches, zero rubber T-latches, zero hinges, zero wheels molded into the body. Drain spigot located strictly near the bottom rim of tall base modules only. Zero AI watermarks or text overlays.
```

**Universal Negative Prompt**:
`rectangular cooler, square box cooler, Yeti chest style, Coleman cooler, hinged lid, domed lid, front draw latches, rubber T-latches, metal clasps, tall skinny Gatorade sports jug, high-gloss shiny plastic, stainless steel drum body, vertical side handles, floating extra text, watermarks`

---

## 4. The 6-Scene Storyboard & Prompts (6 × 10 Seconds = 60 Seconds)

### SCENE 1 (`0:00 – 0:10`) — Slow-Motion Gravity Drop & 5-Tier Modular Studio Stack *(User Request)*
* **Selling Hook**: *"One footprint. Five tiers tall. Zero compromises."* — Instantly proves scale, concentric alignment, and modularity in the first 10 seconds.
* **Color Stack Order (Bottom → Top)**: `28" Patriot Blue Base (with bottom drain spigot)` → `18" Alpine White` → `18" Patriot Red` → `12" Alpine White` → `12" Patriot Red with Flat 10W Circular Solar Lid`.

> **Start-Frame Image Prompt (16:9 Studio Keyframe)**
> Studio architectural commercial photograph on a clean neutral medium-cool gray seamless cyclorama studio background (`#555C66` softly lit with subtle darker vignette corners and a faint glossy concrete studio floor reflection). Centered in tall vertical composition are **five stout 24-inch diameter circular King of Koolers rotomolded cylindrical cooler tiers stacked vertically 5 tiers high** in descending heights from bottom to top: a tall Patriot Blue base tier with a recessed bottom drain spigot, an Alpine White mid tier, a Patriot Red mid tier, an Alpine White upper tier, and a compact Patriot Red top tier crowned with a flat flush recessed lid featuring a dark monocrystalline circular 10W solar disc and flush center bar handle. Each cylindrical tier has crisp horizontal 20-start bayonet twist seams, zero external latches, fine matte micro-stippled polyethylene texture, and opposing **flat horizontal molded side loop handles** sticking straight out radially. Dramatic Apple-keynote three-point studio softbox lighting sculpting crisp rim highlights along the circular curves, ultra-sharp 8K commercial macro clarity, no text, no watermarks.

> **10-Second Video Motion & Camera Prompt (Image-to-Video / Veo / Runway / Kling)**
> 120fps cinematic slow-motion studio sequence on a neutral seamless gray cyclorama backdrop. Starts with the bottom Patriot Blue 24-inch cylindrical base tier planted firmly on the reflective gray floor, then one-by-one from the top of the frame, the remaining four circular cylindrical cooler tiers (Alpine White, Patriot Red, Alpine White, Patriot Red with flat solar lid) drop straight down in silky slow motion along a vertical axis. As each cylindrical tier lands onto the tier below, it performs a sharp, precise `18-degree` (1/20th circle) clockwise rotational twist-lock snap with a crisp subtle puff of sub-zero cold mist escaping each seam, locking seamlessly into a towering 5-cooler stack while the camera executes a smooth vertical pedestal pullback revealing the complete 5-tier monument under crisp gray studio rim light.

* **Optional On-Screen Title (`0:06`)**: `MODULAR BY DESIGN. STACKS 5 TIERS HIGH.`

---

### SCENE 2 (`0:10 – 0:20`) — Public Park Picnic & Dry-Above-Ice Gourmet Feast *(User Request)*
* **Selling Hook**: *"No more soggy sandwiches. Dry culinary organization meets camp seating."*
* **Key Showcase**: Shows a family/friends picnic in a sunny park lifting the dry **All-Thread Adjustable Deli / Charcuterie Carousel** straight out of a cold tier while someone sits effortlessly on a second cooler tier as a stool.

> **Start-Frame Image Prompt (16:9 Lifestyle Keyframe)**
> Bright editorial commercial photograph in a lush, sun-dappled green public park on a clear golden summer afternoon with picnic trees softly bokeh-blurred in the background. On a striped woven picnic blanket on green grass sit two stout 24-inch wide cylindrical rotomolded King of Koolers modules in matte Patriot Blue and Patriot Red, each with opposing flat horizontal molded side loop handles and matte pebbled plastic texture. The Patriot Red cooler is open with its flat circular lid resting beside it, revealing crisp white frosted ice cubes down at the bottom and a gleaming multi-tier circular **All-Thread Adjustable Deli & Charcuterie Carousel** lifted mid-air by a smiling person's hands—heaped cleanly with fresh gourmet turkey club sandwiches, sourdough buns, sliced cheddar, crisp lettuce, and bright strawberries completely dry above the ice. Three feet away on the grass, a friend sits comfortably on top of a closed Alpine White King of Koolers cylindrical tier like a sturdy camp stool holding a cold drink. Warm natural sunlight, crisp Kodak Portra / commercial Apple lifestyle color grading, shallow depth of field, zero latches on the coolers, no text overlays.

> **10-Second Video Motion & Camera Prompt (10s Clip)**
> Smooth handheld gimbal lifestyle shot at a sunny public park picnic. Camera glides softly clockwise around the blanket as a smiling camper smoothly twists a flat circular King of Koolers lid 1/20th of a turn (`18°`) and lifts it cleanly off. In one fluid motion, they lift the stacked multi-tier circular Deli & Charcuterie rack straight out of the chilly Patriot Blue cylinder—delicate cold vapor drifting gently off the ice below while every sandwich, bun, and berry remains crisp and bone-dry—and place the circular platter directly onto the picnic blanket as friends reach in happily, while in the soft background a seated guest leans comfortably on a closed cylindrical cooler tier. Warm sunbeams filtering through park trees, natural lively motion, commercial 24fps film look.

* **Optional On-Screen Title (`0:15`)**: `SEPARATE DRY TIERS. ZERO SOGGY FOOD.`

---

### SCENE 3 (`0:20 – 0:30`) — Indestructible SUV Trunk Toss & Cargo Space Efficiency *(User Request)*
* **Selling Hook**: *"Built rotomolded tough. Toss it in, lock it down, save trunk space."*
* **Key Showcase**: Demonstrates extreme rotomolded impact resistance, flush zero-snag cylindrical silhouette (no broken plastic latches!), and how easily it packs into an SUV cargo hatch.

> **Start-Frame Image Prompt (16:9 Action Lifestyle Keyframe)**
> Crisp daylight action commercial photograph outside at a scenic trailhead parking overlook behind a modern dark charcoal SUV with its rear tailgate wide open. Captured mid-action, an athletic person gripping the flat horizontal molded side loop handles of a locked two-tier cylindrical **King of Koolers (Patriot Blue base + Alpine White upper tier + flat Patriot Red lid with external vertical deadbolt slider pushed flush down)** is about to heave/toss the sealed cylindrical cooler forward into the rugged carpeted SUV trunk cargo area. Inside the spacious SUV trunk, the compact circular geometry leaves plenty of room beside backpacks and folded camp chairs. Crisp daylight shadows, subtle motion energy in the person's stance, matte rotomolded polyethylene texture clearly visible with zero front clasps or latches to snap off on impact, realistic photography, no text.

> **10-Second Video Motion & Camera Prompt (10s Clip)**
> Dynamic action camera shot positioned slightly inside and looking out from the back corner of an open rugged SUV tailgate. An outdoorsman swings a sealed 2-tier red-white-and-blue cylindrical King of Koolers forward by its molded horizontal side handles and tosses/heaves it solidly into the SUV cargo floor (`0:02–0:04` crisp subtle slow-motion thud and suspension bounce). The rugged rotomolded cooler slides cleanly to rest in the right corner of the trunk—completely intact, zero external latches to break, the lid locked hermetically sealed with its vertical side deadbolt slider still engaged, and zero water spilled—followed by the tailgate closing decisively over a perfectly packed cargo bay with ample space for adventure bags beside it. High-energy commercial cinematography.

* **Optional On-Screen Title (`0:25`)**: `ROTOMOLDED ARMOR. ZERO LATCHES TO SNAP.`

---

### SCENE 4 (`0:30 – 0:40`) — High-Converting Seller #1: Patented "1/20th Turn (18°) & Vertical Deadbolt" Demo
* **Why This Sells Hard**: Solves every buyer's #1 skepticism on screen (*"How do I take the top cooler off without unscrewing the bottom lid?"*). Turning the patent into an unmistakable 10-second mechanical hero shot sells engineering superiority instantly.

> **Start-Frame Image Prompt (16:9 Patent Engineering Macro Keyframe)**
> Ultra-crisp studio-lit macro product photograph on a dark slate outdoor workbench showcasing two stacked 24-inch cylindrical King of Koolers tiers: a matte Patriot Blue lower cooler capped by a flush Patriot Red circular lid, with an Alpine White upper cooler tier stacked upright directly on top of the red lid. On the outer right shoulder of the Patriot Red lid, an anodized metallic cyan-and-steel **external Vertical Deadbolt Slider** sits cleanly recessed in a dovetail channel directly aligned above a vertical receiver slot molded into the Patriot Blue collar below. Sharp close-up lighting highlights the visible precision 20-start spiral bayonet rim, thick black EPDM rubber compression seal, molded flat horizontal loop handles, and matte micro-stippled polyethylene grain. Ultra-clean commercial hardware photography, dark studio background with crisp rim lighting, zero text overlays.

> **10-Second Video Motion & Camera Prompt (10s Clip)**
> Precision mechanical macro commercial shot in two snappy beats. First (`0:00–0:04`), a close-up finger firmly pushes the recessed Vertical Deadbolt Slider on the outer rim of the Patriot Red lid straight DOWN `12 mm` with an authoritative mechanical snap directly into the lower blue cooler's collar slot, anchoring the lid solid. Immediately (`0:04–0:10`), two hands grip the opposing horizontal loop handles of the Alpine White upper cooler stacked on top and twist it counter-clockwise a tiny **1/20th of a circle (`18 degrees`)**—lifting the white upper cooler cleanly away into the air while the red lid underneath remains 100% locked, sealed, and motionless on the blue base. Crisp macro focus rack, Satisfying precision engineering aesthetic.

* **Optional On-Screen Title (`0:35`)**: `1/20TH TURN LOCK. PATENTED VERTICAL DEADBOLT.`

---

### SCENE 5 (`0:40 – 0:50`) — High-Converting Seller #2: "The Circle Advantage" — 10-Day Ice Core, Spigot Pour & 10W USB Solar Lid
* **Why This Sells Hard**: Hits **three emotional + functional conversion triggers** in 10 seconds: sub-zero ice preservation (Circle Advantage vs. hot corners), refreshing cold water pour on demand, and off-grid smartphone charging from the lid.

> **Start-Frame Image Prompt (16:9 Sensory Commercial Keyframe)**
> Dramatic golden-hour outdoor camp-kitchen commercial photograph showing a single stout 24-inch cylindrical **King of Koolers 28-inch Patriot Blue base tier** topped with its **flat recessed circular 10W Solar Panel Lid** resting on a weathered timber deck overlooking calm water. Plugged into the waterproof USB port bezel on top of the matte solar lid is a modern smartphone resting cleanly on the flat lid surface displaying a bright green charging bolt. Down near the bottom front skirt of the cylindrical cooler, a crisp stainless-accented **fast-flow quarter-turn drain spigot** sits cleanly above an insulated stainless tumbler resting on a wooden step. The 3.5-inch thick rotomolded polyethylene wall shows crisp frost beads near the top rim, heavy horizontal molded side handles, zero exterior buckles. Rich golden sunset backlight rimming droplets of condensation, appetizing ultra-real 8K commercial look, no text.

> **10-Second Video Motion & Camera Prompt (10s Clip)**
> Lush slow-motion sensory commercial shot. Camera glides upward from the bottom quarter-turn spigot of a condensation-kissed Patriot Blue cylindrical cooler as crisp, sparkling ice-cold water pours cleanly into a waiting camp cup (`0:00–0:04`), pans smoothly up the matte rotomolded wall past subtle shimmering thermal heat distortion kept completely outside the 3.5-inch circular R-8 foam core (`0:04–0:07`), and settles onto the top 10W monocrystalline solar lid bathed in golden sunlight where a smartphone screen lights up showing rapid USB charging (`0:07–0:10`). Rich warm golden highlights balanced with icy cyan condensation cool tones.

* **Optional On-Screen Title (`0:45`)**: `34% LESS HEAT LOSS · 10-DAY ICE · 10W SOLAR.`

---

### SCENE 6 (`0:50 – 1:00`) — High-Converting Seller #3: The Expedition Fleet Finale & Brand Crown Reveal
* **Why This Sells Hard**: Closes like an Apple keynote film—leaving viewers imagining *themselves* owning multiple modules across beach, overland camp, and backyard hosting, with clean negative space on the top-left for the website's **"King of Koolers. The Shape of Cold."** typography.

> **Start-Frame Image Prompt (16:9 Closing Hero Panorama)**
> Cinematic wide-angle golden-hour landscape product photograph on a dramatic granite shoreline overlooking a reflective alpine mountain lake at dusk, framed deliberately with generous clean deep-twilight sky and dark water negative space in the upper-left quadrant for webpage headline composition. In the right and lower-center foreground stand three distinct **King of Koolers 24-inch circular modular cooler builds** cleanly spaced side-by-side: (1) the flagship **3-tier Patriot Red, White, and Blue stacked tower** mounted on an optional all-terrain sand wagon cart base with wide balloon tires; (2) a stealthy **2-tier Matte Charcoal** overland stack next to a glowing low campfire; and (3) a vibrant **Blaze Orange single vault tier** with fishing tackle gear resting nearby. Every cooler maintains exact 24-inch wide cylindrical proportions, flat flush recessed lids, seamless horizontal loop handles, and matte micro-stippled texture with zero clasps or rectangular edges. Dramatic sunset mountain light, subtle lakeside mist, ultra-sharp commercial cinema frame, no embedded text.

> **10-Second Video Motion & Camera Prompt (10s Clip)**
> Epic slow cinematic crane pullback over an alpine mountain lake shoreline at twilight sunset (`0:00–0:10`). Starts on a sleek 3-tier Patriot Red, White, and Blue King of Koolers tower gliding smoothly forward two steps on its all-terrain rolling base before locking parked beside a stealth charcoal overland stack and a blaze orange angler tier. As the camera pulls back smoothly and rises slightly, glowing twilight amber light dances across the cylindrical curves and glassy lake while gentle mountain mist drifts behind the lineup, settling cleanly on an iconic balanced hero composition with clean twilight space on the left ready for brand titles.

* **Optional End-Card Overlay (`0:56–1:00`, added in post over clean sky/fade)**:
  `KING OF KOOLERS` / `THE SHAPE OF COLD.` *(Patent Pending · Designed by Austin Marshall)*

---

## 5. Audio, Pacing & Final Assembly Cheat Sheet (For When You Render the Final Video)

* **Audio Bed (`0:00–1:00`)**: Modern cinematic minimal percussive synth (starts muted by default for HTML5 autoplay compliance, with instant **Unmute** toggle for desktop/mobile viewers).
  * `0:00–0:10`: Deep sub-bass impacts + subtle hydraulic/ratchet `CLICK` timed to each of the 5 tiers snapping together.
  * `0:10–0:20`: Acoustic guitar / warm bright percussion transition for the sunny park picnic.
  * `0:20–0:30`: Heavy trunk thud SFX + driving percussive beat drop.
  * `0:30–0:40`: Crisp mechanical deadbolt *SNICK* + subtle futuristic riser.
  * `0:40–0:50`: Refreshing crystal water pour SFX + soaring warm pad swell.
  * `0:50–1:00`: Wide cinematic resolution chord, ending on a clean 1-second hold on Scene 6's hero frame.
* **Post-Production FFmpeg Stitch Command**: Once your six 10-second clips (`clip_01.mp4` ... `clip_06.mp4`) are ready, we can automatically stitch, color-match, add clean Apple-style kinetic captions, normalize web bitrate (`H.264 / yuv420p / +faststart`), save as `assets/videos/hero_sizzle_reel_60s.mp4`, and wire the first-visit autoplay experience right into [index.html](file:///e:/Documents/AiPrograms/KingOfKoolers/index.html) using the FFmpeg binary already installed in your workspace.
