# Parth's Autonomous Business Agent (Mark-LIII)

> Autonomous, voice-activated business operations platform combining **Mark-LIII Voice HUD**, **314 Agency Specialist Agents**, **Scenario 2: Multi-Agent Sales Workflow**, and the **11 LinkedIn Skills Hub**.
> 
> **100% Free & Open-Source** • Runs entirely on your local PC (Windows, macOS, or Linux).

---

## 📑 Table of Contents
1. [Official Prerequisites & Actual Download Links](#-official-prerequisites--actual-download-links)
2. [Step-by-Step Installation (Git Already Connected)](#-step-by-step-installation-git-already-connected)
   - [Windows 10 / 11 (PowerShell)](#windows-10--11-powershell)
   - [macOS (Terminal)](#macos-terminal)
   - [Linux (Ubuntu / Debian / Fedora)](#linux-ubuntudebian)
3. [Gemini API Key Setup (100% Free)](#-gemini-api-key-setup-100-free)
4. [Running the System](#-running-the-system)
   - [Terminal 1: Web Dashboard & Server](#terminal-1-web-dashboard--backend-server)
   - [Terminal 2: Mark-LIII Voice Daemon](#terminal-2-mark-liii-voice-daemon)
5. [Bluetooth Audio & Microphone Auto-Handover](#-bluetooth-audio--microphone-auto-handover)
6. [314 Agency Agents CLI Installation](#-314-agency-agents-cli-installation)
7. [Cloud Deployment (Run on Cloud)](#-cloud-deployment-run-on-cloud)
   - [Method 1: 1-Click Deploy on Google Cloud Run](#method-1-1-click-deploy-on-google-cloud-run)
   - [Method 2: Deploy on Render or Railway (From Git)](#method-2-deploy-on-render-or-railway-from-git)
   - [Method 3: Deploy with Docker & Docker Compose](#method-3-deploy-with-docker--docker-compose)
8. [Common Issues & Exact Solutions](#-common-issues--exact-solutions)

---

## 🛠️ Official Prerequisites & Actual Download Links

Before running the commands, install these free dependencies on your machine:

| Software | Version | Actual Download Link |
| :--- | :--- | :--- |
| **Node.js** | v20 or v22 (LTS) | [https://nodejs.org/en/download](https://nodejs.org/en/download)<br>*(Windows direct: [node-v22.14.0-x64.msi](https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi))* |
| **Python** | 3.11 or 3.12 | [https://www.python.org/downloads/](https://www.python.org/downloads/)<br>*(IMPORTANT: On Windows installer, check **"Add python.exe to PATH"**)* |
| **Google AI Studio Key** | Free Tier | [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)<br>*(Free API key, no credit card or subscription needed)* |
| **Vosk Wake-Word Model** | Small English (50MB) | [https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip](https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip) |
| **Agency Agents Repo** | 314 Roles | [https://github.com/msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) |

---

## 🚀 Step-by-Step Installation (Git Already Connected)

Since your Git repository is already connected to your local machine, **do not clone again**. Simply open your terminal directly in the project folder (for example, in VS Code press `Ctrl + ~` or `Terminal > New Terminal`).

---

### Windows 10 / 11 (PowerShell)

#### Step 1: Install Node.js Dependencies & Configure Environment
In your PowerShell terminal inside the project folder:
```powershell
# 1. Install project node modules
npm install

# 2. Copy the environment configuration template
Copy-Item .env.example .env

# 3. Open .env with Notepad
notepad .env
```
In Notepad, paste your free Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
PORT=3000
```
Save (`Ctrl + S`) and close Notepad.

#### Step 2: Set Up Python for the Mark-LIII Voice Daemon
In the same folder, run:
```powershell
# If script execution is blocked on Windows, allow scripts for your user:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Upgrade pip and install audio & PC control packages
python -m pip install --upgrade pip
pip install vosk sounddevice numpy pyautogui pyttsx3 google-genai python-dotenv

# Download the 50MB offline Vosk wake-word model
mkdir model -ErrorAction SilentlyContinue
curl -L https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip -o model.zip
tar -xf model.zip
Move-Item -Path "vosk-model-small-en-us-0.15" -Destination "model\vosk" -Force
Remove-Item model.zip
```

---

### macOS (Terminal)

#### Step 1: Install Node.js Dependencies & Configure Environment
Open Terminal in your project folder:
```bash
# 1. Install node dependencies
npm install

# 2. Create your .env file
cp .env.example .env
nano .env
```
Paste your key:
```env
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here
PORT=3000
```
Save (`Ctrl + O`, then `Enter`, then `Ctrl + X`).

#### Step 2: Set Up Python for Mark-LIII Voice Daemon
```bash
python3 -m venv venv
source venv/bin/activate

pip install --upgrade pip
pip install vosk sounddevice numpy pyautogui pyttsx3 google-genai python-dotenv

# Download offline wake-word model
mkdir -p model
curl -L https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip -o model.zip
unzip model.zip
mv vosk-model-small-en-us-0.15 model/vosk
rm model.zip
```

---

### Linux (Ubuntu/Debian)

```bash
# Install audio development headers
sudo apt update
sudo apt install -y build-essential python3-dev python3-venv portaudio19-dev libasound2-dev espeak ffmpeg unzip

# Node dependencies & .env
npm install
cp .env.example .env

# Python virtual environment
python3 -m venv venv
source venv/bin/activate
pip install vosk sounddevice numpy pyautogui pyttsx3 google-genai python-dotenv

# Vosk offline model
mkdir -p model
curl -L https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip -o model.zip
unzip model.zip && mv vosk-model-small-en-us-0.15 model/vosk && rm model.zip
```

---

## 🏃 Running the System

Open **two terminal tabs** in your project directory:

### Terminal 1: Web Dashboard & Backend Server
```bash
npm run dev
```
Wait for `Server running on http://localhost:3000` to appear.
Open your browser to:
👉 **[http://localhost:3000](http://localhost:3000)**

You now have access to:
- **Mark-LIII Voice HUD** (Interactive audio reactor, real-time waveform, recallable memory)
- **Agency Agents** (All 314 specialist personas categorized by department)
- **Scenario 2: Multi-Agent Sales Swarm** (Sequential outbound pipeline with interactive MEDDPICC scorecard & financial calculations)
- **11 LinkedIn Skills Hub** (Post generation with 2026 voice-rule auditing)

---

### Terminal 2: Mark-LIII Voice Daemon
In the second terminal tab:

**On Windows:**
```powershell
.\venv\Scripts\Activate.ps1
python mark_liii_daemon.py
```

**On macOS / Linux:**
```bash
source venv/bin/activate
python mark_liii_daemon.py
```

- Say **"Hey Jarvis"** into your microphone to activate voice commands.
- Commands you can try:
  - *"Hey Jarvis, open Chrome"*
  - *"Hey Jarvis, run sales workflow"*
  - *"Hey Jarvis, summarize today's operational goals"*
  - *"undo"* (reverses last desktop action)
  - Type `devices` to inspect all connected audio input and output streams.

---

## 🎧 Bluetooth Audio & Microphone Auto-Handover

If you connect a Bluetooth headset or earbuds (AirPods, Galaxy Buds, Sony WH-1000XM, Bose, Jabra, etc.):
1. **In the Web HUD**:
   - The embedded **Bluetooth Audio & Mic Auto-Handover** card detects device changes in real time.
   - Click **"Test Mic"** to see live microphone levels.
   - Click **"Test Chime"** to hear sound confirmation directly in your Bluetooth headset.
2. **In the Python Daemon (`mark_liii_daemon.py`)**:
   - Auto-scans every 2.5 seconds.
   - Binds `sd.default.device = (bt_microphone, bt_speaker)`.
   - JARVIS announces: *"Bluetooth audio device connected. Microphone and speaker routed to Bluetooth headset."*
3. **OS-Level Setting**:
   - **Windows**: Settings > System > Sound > Set your Bluetooth headset as **Default Audio Device** and **Default Communication Device**.
   - **macOS**: System Settings > Sound > Confirm output and input are set to your headset.
   - **Linux**: `pactl load-module module-switch-on-connect`.

---

## 📦 314 Agency Agents CLI Installation

To run any of the 314 agency roles from your terminal:
```bash
# Automated one-line installer
curl -fsSL https://agencyagents.dev/install.sh | bash

# Or direct git clone
git clone https://github.com/msitarzewski/agency-agents.git ~/.agency-agents
```
Example execution:
```bash
agency-run "Sales/Outbound-Strategist" --task "Create 3 cold email angles for enterprise prospects"
```

---

## ☁️ Cloud Deployment (Run on Cloud)

You can run Parth's Autonomous Business Agent 24/7 on the cloud so it is accessible from any phone, laptop, or browser worldwide.

### Method 1: 1-Click Deploy on Google Cloud Run (Recommended)
1. In Google AI Studio Build (top right bar), click **"Deploy"** or **"Share"**.
2. Select **Cloud Run** as your target.
3. Google AI Studio will automatically build your Docker container and provision a secure HTTPS URL (e.g., `https://your-agent.run.app`).
4. Paste your free `GEMINI_API_KEY` into the deployment environment variables.

Alternatively, deploy via Google Cloud CLI:
```bash
gcloud run deploy parths-agent \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_api_key_here",PORT=3000
```

---

### Method 2: Deploy on Render or Railway (From Git)

If your repository is on GitHub:

#### On Render.com (Free Tier):
1. Create a free account at [https://render.com](https://render.com).
2. Click **New + > Web Service** and connect your GitHub repository.
3. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` = `your_gemini_api_key_here`
   - `PORT` = `3000`
5. Click **Deploy Web Service**. Your app will be live with free SSL.

#### On Railway.app:
1. Go to [https://railway.app](https://railway.app) and create a project from your GitHub repo.
2. Railway automatically detects `Dockerfile` or `package.json`.
3. Add `GEMINI_API_KEY` in the Variables tab.
4. Click Deploy.

---

### Method 3: Deploy with Docker & Docker Compose

For AWS EC2, DigitalOcean Droplet, Linode, or any Linux VPS:

```bash
# 1. Build the production Docker image
docker build -t parths-autonomous-agent .

# 2. Run the container
docker run -d \
  -p 3000:3000 \
  --name autonomous-agent \
  -e GEMINI_API_KEY="your_actual_gemini_api_key" \
  -e PORT=3000 \
  --restart unless-stopped \
  parths-autonomous-agent
```

Or using **Docker Compose**:
```bash
# Set your key in .env, then launch:
docker compose up -d
```

---

## ❓ Common Issues & Exact Solutions

### 1. `Port 3000 is already in use`
- **Windows**:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
  ```
- **macOS / Linux**:
  ```bash
  npx kill-port 3000
  ```

### 2. `cannot be loaded because running scripts is disabled on this system` (Windows)
Run PowerShell as Administrator or run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

### 3. `Vosk model not found`
Ensure your directory structure is:
```
your-project/
  ├── model/
  │    └── vosk/
  │         ├── am/
  │         ├── conf/
  │         └── graph/
  ├── mark_liii_daemon.py
  └── package.json
```
If you extracted it into `model/vosk-model-small-en-us-0.15`, rename that folder to `vosk` inside `model/`.

### 4. `GEMINI_API_KEY is not defined`
Make sure you created a file named `.env` (not `.env.txt` or `.env.example`) in the root folder with:
```env
GEMINI_API_KEY=your_actual_key_here
```
Get your free key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
