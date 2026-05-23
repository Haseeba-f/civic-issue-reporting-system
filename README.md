<div align="center">

# 🏙️ AI Civic Issue Reporting System

**Report urban issues instantly — one image, zero forms.**

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)
[![Hackathon](https://img.shields.io/badge/Hackathon-Top%2070%20of%20220%2B-gold?style=flat)](https://github.com/Haseeba-f/civic-issue-reporting-system)

[Overview](#overview) · [Features](#features) · [Demo](#how-it-works) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Team](#team)

</div>

---

## Overview

Urban civic issues — potholes, overflowing garbage, broken streetlights — often go unresolved for weeks or months due to slow, manual, and inaccessible reporting systems. Citizens are expected to fill lengthy forms, write detailed descriptions, and navigate complex municipal procedures, leading to low engagement and delayed action.

**AI Civic Issue Reporting System** eliminates that friction. Citizens upload a single photo; the platform handles everything else — detecting the issue, assigning priority, capturing location, and generating a formal complaint — in seconds.

> 🏆 **Selected among the top 10 teams out of 220+ submissions** at a national-level hackathon in the domain of *Intelligent Systems & AI Innovation.*

---

## Features

| Feature | Description |
|---|---|
| 📸 **One-Click Reporting** | Upload a single image — no forms, no manual input |
| 🧠 **AI Issue Detection** | MobileNet-powered computer vision classifies potholes, garbage, streetlights, and more |
| ⚠️ **Auto Severity & Priority** | Rule-based engine assigns urgency levels for faster triage |
| 📝 **Formal Complaint Generation** | Structured, actionable complaint documents generated automatically |
| 📍 **Location-Aware** | Browser Geolocation API captures precise coordinates |
| 📊 **Instant Feedback** | Real-time classification results and report confirmation |
| 📱 **Mobile-First Design** | Fully responsive interface optimized for smartphones |

---

## How It Works

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  1. Upload Image │───▶│  2. AI Detection  │───▶│ 3. Severity &   │
│                 │    │  (MobileNet CNN)  │    │   Priority Set  │
└─────────────────┘    └──────────────────┘    └────────┬────────┘
                                                        │
┌─────────────────┐    ┌──────────────────┐    ┌────────▼────────┐
│  6. Stored for  │◀───│  5. Report Filed  │◀───│ 4. Complaint    │
│     Tracking   │    │                  │    │   Generated     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

1. **Capture** — User uploads or takes a photo of a civic issue
2. **Classify** — MobileNet model identifies the issue type with confidence scoring
3. **Prioritize** — Rule-based engine assigns severity (Low / Medium / High / Critical)
4. **Locate** — Browser Geolocation API captures GPS coordinates
5. **Generate** — A formal, structured complaint is produced automatically
6. **Store** — Report is saved to the database for tracking and authority review

---

## Tech Stack

**Frontend**
- React.js — component-based UI
- Tailwind CSS — responsive, mobile-first styling

**Backend**
- FastAPI (Python) — lightweight, high-performance REST API

**AI & Intelligence**
- Pretrained MobileNet — image classification via transfer learning
- Rule-based engine — explainable severity and priority assignment
- Template engine — formal complaint generation in Python

**Infrastructure**
- Browser Geolocation API — real-time GPS capture
- SQLite — embedded database for report storage
- Docker — optional containerized deployment

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- pip & npm

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Haseeba-f/civic-issue-reporting-system.git
cd civic-issue-reporting-system

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn backend_api:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend Setup

```bash
# Navigate to the frontend directory
cd civic-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`.

---

## Handled Challenges

| Challenge | Solution |
|---|---|
| Poor image quality | Confidence threshold validation — low-confidence images are flagged for user review |
| Misclassification | Rule-based priority logic provides a safety net over AI output |
| Network unreliability | Lightweight backend design minimizes latency and failure surface |

---

## Roadmap

- [ ] Authority dashboard for issue tracking and status updates
- [ ] Push notifications for real-time complaint status
- [ ] Cloud deployment (AWS / GCP)
- [ ] Multi-city and multi-language support
- [ ] Historical analytics and heatmaps for urban planners
- [ ] Integration with municipal APIs for direct complaint submission

---

## Team

**Team Lead**
- **Haseeba** — MLR Institute of Technology

**Team Members**
- **Hafsa Fathima** — Jayaprakash Narayan College of Engineering
- **Khadeeja Khadeer** — Jayaprakash Narayan College of Engineering

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change, then submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

If this project helped or inspired you, please consider giving it a ⭐

</div>
