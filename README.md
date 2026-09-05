# Mercury — Policy-Governed Agentic Commerce Gateway

> **Razorpay Buildathon 2026** — Track 01: *AI Growth & Agentic Commerce*  
> Tagline: *"The infrastructure layer that makes a merchant sellable, understandable, and transactable to autonomous AI buyers."*

---

## 📌 Problem Statement

Ordinary merchant websites are designed for human eyes, not autonomous AI buyers. When an AI agent attempts to buy products, it encounters un-structured HTML, missing stock schemas, unpredictable pricing, and lack of transaction governance.

**Mercury** is the **AI-Native Merchant Commerce Gateway** that acts as the infrastructure layer between independent AI buyers and merchant stores.

```
                 MERCHANT STORE
                       │
                       ▼
             ┌──────────────────┐
             │ MERCURY GATEWAY  │
             │ Infrastructure   │
             └─────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  Agentic Catalog   Policy Engine   Razorpay Test
  (JSON-LD / OpenAPI) (Air-Gap Limits)  (HMAC Verified)
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
             INDEPENDENT AI BUYER
```

---

## ✨ Core Features & Technical Innovations

### 1. Agentic Catalog Infrastructure (`/api/ai-catalog` & `/api/ai-catalog/openapi.json`)
Exposes machine-readable JSON-LD feeds and OpenAPI 3.0 specifications for third-party AI agents (ChatGPT, Claude, AutoGPT) to inspect catalog items, inventory, negotiable discount boundaries, and Razorpay endpoints.

### 2. Autonomous Merchant Growth Agent (`/api/growth/insights`)
Analyzes purchase affinity vectors across historical SQLite orders to deliver evidence-based dynamic co-purchase upsells (e.g. 31% co-purchase rate for Wrist Rest with Mechanical Keyboards), driving a **+16.6% AOV uplift**.

### 3. Air-Gapped Financial Policy Engine (`lib/policy/engine.ts`)
Separates LLM reasoning from financial execution. Financial caps (`maxAutoDiscountAmount: ₹1,000`, `maxAutoTransactionAmount: ₹10,000`) automatically authorize in-bounds transactions, while escalating out-of-bounds requests (e.g. ₹15,000 discount) to a human **Merchant Approval Gate**.

### 4. Server-Verified Razorpay Test Gateway (`lib/razorpay/service.ts`)
- Official Razorpay SDK integration for server-side order creation (`order_Pxxxx...`).
- Cryptographic server-side HMAC-SHA256 signature verification (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`).
- Built-in transparent fallback badge: `DEMO SIMULATION MODE (NO KEYS CONFIGURED)`.

### 5. Hands-Free Voice AI Buyer Agent (`/buyer`)
Integrated Web Speech API dictation (hands-free microphone intent input) and Text-to-Speech (TTS) vocalization of AI recommendations and evidence.

---

## 🛠 Quickstart & Installation

```bash
# 1. Clone repository
git clone https://github.com/harshith7002/Mercury.git
cd Mercury

# 2. Install dependencies
npm install

# 3. Setup environment variables (Optional - App falls back gracefully to Demo Simulation if keys omitted)
# Create .env.local:
# NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
# RAZORPAY_KEY_SECRET="..."

# 4. Generate Prisma client & seed SQLite database
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 5. Run development server
npm run dev
# Open http://localhost:3000
```

---

## 🧪 Verification & Audit Suite

Run automated functional audits to verify end-to-end platform integrity:

```bash
# Run 28-point Hostile Functional Audit Test Suite
npx tsx scripts/test-suite.ts

# Run 5-Point Mathematical Proof & Category Contract Verification Suite
npx tsx scripts/verify-5-checks.ts
```

---

## 🎯 Razorpay Buildathon & Interview Q&A

### Q1: What makes Mercury an AI Agent platform rather than a simple chatbot?
> *"The LLM never directly executes financial actions. Instead, the AI buyer acts as a planner using typed tools. Every proposed transaction passes through an air-gapped Policy Engine. If an action exceeds merchant boundaries (e.g. ₹15,000 discount request), the Policy Engine blocks it, generates an AI ROI rationale, and routes it to human merchant approval."*

### Q2: How do you handle Razorpay payment security?
> *"Order creation is strictly server-side (`RazorpayService.createOrder`). Payment signature verification is executed on the server using HMAC-SHA256 algorithm matching `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. Only upon valid signature verification is the order state transitioned to CAPTURED in SQLite."*

### Q3: How is revenue attribution computed?
> *"We compute net base revenue and incremental upsell revenue from SQLite order items. The attribution equation `Net Base Revenue + Incremental AI Upsell Revenue === Total Captured Revenue` is mathematically verified across all captured orders."*
