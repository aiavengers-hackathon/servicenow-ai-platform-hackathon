Presentation notes and rendering instructions

Requirements
- Node.js (for Marp CLI) OR Docker

Render with Marp (recommended):

1. Install marp CLI (temporary via npx):

```bash
cd presentation
npx @marp-team/marp-cli@latest DEMO_SLIDES.md --html --allow-local-files -o DEMO_SLIDES.html
# To export as PDF
npx @marp-team/marp-cli@latest DEMO_SLIDES.md --pdf --allow-local-files -o DEMO_SLIDES.pdf
```

2. Open `DEMO_SLIDES.html` in your browser or present the PDF.

Alternative: use Docker image for marp

```bash
docker run --rm -v "$PWD":/home/marp/project -w /home/marp/project marpteam/marp-cli npx @marp-team/marp-cli DEMO_SLIDES.md --html -o DEMO_SLIDES.html
```

Presenter checklist
- Start backend: `bash scripts/run_local.sh dev` (or `uvicorn app.main:app --reload`)
- Start frontend: `bash scripts/run_local.sh dev` (script runs both)
- Open frontend (dev): http://localhost:5173
- Use Admin page to inspect created tickets

Notes
- The slide deck references repository files; include screenshots by saving images into `presentation/assets/` and referencing them in the markdown if desired.
