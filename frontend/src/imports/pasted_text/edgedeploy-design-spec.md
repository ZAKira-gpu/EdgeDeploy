Design a modern SaaS web application called "EdgeDeploy".

Purpose:
EdgeDeploy is a developer tool that converts AI models for edge deployment (PyTorch → ONNX → TensorFlow Lite with optional quantization).

Target users:
AI engineers, ML developers, mobile AI developers.

Design style:
- Clean, minimal, developer-focused
- Dark mode first (primary)
- Inspired by Vercel, Supabase, and GitHub
- Professional and technical, not playful
- Use a neutral color palette with a strong accent (blue or purple)

---

Pages to design:

1. Landing Page
- Hero section:
  Headline: "Convert AI Models for Edge Deployment in Seconds"
  Subtext: "Upload your PyTorch or ONNX model and get edge-ready formats instantly."
  CTA buttons: "Get Started" and "View Demo"
- Feature section:
  - PyTorch → ONNX → TFLite conversion
  - Quantization (INT8 / FP16)
  - Fast cloud processing
- How it works (3 steps)
- Developer-focused footer

---

2. Authentication Page
- Clean split layout or centered card
- Buttons:
  - "Continue with GitHub"
  - "Continue with Google"
- Minimal input fields (optional email)
- Subtle branding and trust elements

---

3. Dashboard
Main layout:
- Sidebar (left):
  - Dashboard
  - New Conversion
  - History
  - Settings
- Top bar:
  - User profile
  - Logout

Main content:
- "New Conversion" card:
  - Upload model (drag & drop)
  - Select input/output format
  - Select quantization (optional)
  - Convert button

---

4. Conversion Progress Page
- Show live progress:
  - Uploading
  - Converting
  - Optimizing
- Progress bar or step indicator
- Logs panel (developer style, like terminal)

---

5. Results Page
- Conversion summary:
  - Input format
  - Output format
  - Model size comparison
- Download button
- Optional metrics (latency, size reduction)

---

6. History Page
- Table of past conversions:
  - Model name
  - Format
  - Status
  - Date
  - Download button

---

Components:
- Buttons (primary, secondary)
- Cards
- Upload drag-and-drop area
- Progress bars
- Tables
- Modal dialogs

---

UX Requirements:
- Simple flow (upload → convert → download)
- Developer-friendly layout
- Clear hierarchy and spacing
- Responsive design (desktop + tablet)

---

Extra:
- Add subtle animations (hover, loading)
- Use icons for formats (PyTorch, ONNX, TFLite)
- Keep everything fast and minimal