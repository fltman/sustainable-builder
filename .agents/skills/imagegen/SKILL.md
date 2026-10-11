---
name: imagegen
description: Generate bitmap art for a place's vision site – above all the link-preview image (og.jpg, 1200×630: the place in 2126 with its real landmarks, green roofs and people) and a film poster – with Codex's image tool or the bundled script (OpenAI or OpenRouter). Use when the user wants preview art, a poster or other images for the site. A render from the site itself (`look`) is the free alternative.
---

# Images for a place's vision site

The link preview (Messenger, Slack, LinkedIn …) shows `cities/<slug>/pack/og.jpg` (1200×630; the page's
title and description come from `vision/config.js` → `meta`). The free way is a picture of the running
site (`python3 sustainable.py look <slug>` takes them; crop one to 1200×630). A painted one:

## Link-preview recipe

1. Write the prompt from the place's research and places: the landmarks that make it recognisable (the
   church, the shore, the square, the station), the season, and the vision of 2126 – green roofs and
   solar, gardens where the asphalt was, people outdoors, boats on the water. Keep these constraints:
   - wide 1200×630, the place recognisable at a glance, calm space for nothing (no title in the image)
   - daylight or golden hour, natural colours
   - **no text, no logos, no watermarks, no recognisable real people**
2. Generate, using what your environment offers:
   - **Codex**: the built-in image generation tool (no key needed); a `look` picture of the site is the
     best composition reference. Copy the chosen result into the project.
   - **Claude Code or a terminal** (needs `OPENAI_API_KEY` or `OPENROUTER_API_KEY` in `.env`):
     ```sh
     .venv/bin/python .agents/skills/imagegen/scripts/generate_image.py \
       --prompt "<prompt>" --reference cities/<slug>/renders/site/<vision>-2126.jpg \
       --out cities/<slug>/pack/og.jpg --size 1200x630
     ```
     `--provider openai|openrouter` picks the service (default: whichever key exists, OpenAI first);
     `--model` overrides the default. Drop `--reference` for a free composition.
3. Look at the result. Reject images with text, invented landmarks, or no sense of the place. One or two
   retries with a sharper prompt are normal.
4. Record the final prompt in `cities/<slug>/vision/og-prompt.md` (provider, model, date). Image
   generation costs money: ask the user before the first paid call in a session.

## Other images

The same script makes a film poster (`--size 1920x1080`, saved as `pack/film/poster.jpg` after
`sustainable.py film`) or other art (`--size keep`).
