# Lokta Borrower Copilot — Final Submission

A local-first React/Vite prototype for the Lokta Borrower Copilot Build Challenge.

## Run

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

Production check:

```bash
npm run build
npm run preview
```

## What is included

- Adaptive borrower questionnaire
- Borrow / Borrow less / Don't borrow decision
- Separate safer amount vs indicative lender-style ceiling
- Fair interest-rate band
- APR-style all-in cost view including stated fee
- Monthly EMI and tenure trade-off
- 20% income-drop stress case
- Confidence ranges that widen when adaptive answers are missing
- One-page Negotiation Card with copy action
- Three required persona run-throughs: Priya, Ravi and Anita
- Inspectable `RULES.md`
- No login, backend, bureau pull or persistent personal-data store

## Three run-throughs

### Priya — salaried, wedding
Expected reasoning:
- Strong documented income and known 780 score support a relatively tight rate band.
- The ₹8L discretionary request is compared with the safer cash-flow ceiling.
- Negotiation focus: rate, processing fee, EMI and whether the requested amount is worth the wedding purpose.

### Ravi — self-employed, business
Expected reasoning:
- Variable business income creates a wider affordability view.
- Stated collateral can improve indicative pricing, but the app does not assume collateral guarantees approval.
- Productive purpose can support the case, but future business return is not counted as guaranteed income.
- Negotiation focus: secured vs unsecured structure, rate, fees, tenure and final KFS.

### Anita — informal, scooter + existing debt
Expected reasoning:
- Informal income, existing app debt, high-cost debt and a recent bounce materially reduce the safe ceiling.
- The app can reach a **Don't borrow** outcome when the requested amount is materially above the stressed safe capacity.
- The productive purpose does not override current repayment stress.
- Negotiation focus should include clearing/restructuring expensive debt before adding another obligation.

## 5-minute walkthrough script

**0:00–0:30 — Problem**
“Borrowers often ask three different questions at once: will a lender approve me, what can I safely afford, and is the price fair? This copilot separates those questions.”

**0:30–1:30 — Adaptive flow**
“Start with the core inputs. The app asks follow-ups only when they change the model: income stability, savings, bounces, expensive debt, collateral and productive return. Unknown credit score stays unknown.”

**1:30–2:30 — Decision**
“The result has four outputs: decision, two borrowing ceilings, fair rate plus all-in cost, and EMI with a stress case. Each major number includes a reason.”

**2:30–3:30 — Negotiation Card**
“The card turns the analysis into lender-facing asks: final APR/KFS, fees, EMI, tenure, prepayment and penalty terms.”

**3:30–4:30 — Personas**
“Use the home-page demo buttons for Priya, Ravi and Anita. They illustrate different risk patterns: strong salaried income, self-employed collateral-backed borrowing, and fragile informal cash flow.”

**4:30–5:00 — Limits**
“This is a transparent planning tool, not a lender decision or APR certificate. Final lender documents control. The code and `RULES.md` expose the assumptions so they can be challenged.”

## Submission checklist

- [x] Working app
- [x] Adaptive questionnaire
- [x] Four required outputs
- [x] Negotiation Card
- [x] Three borrower demos
- [x] Rules/assumptions table
- [x] Explainability and confidence handling
- [x] No backend required
- [x] README and walkthrough
- [x] Responsive UI
- [x] Production build command

## Disclaimer

This prototype provides indicative educational/planning estimates only. It is not a lender, credit bureau, financial adviser, sanction engine, or guarantee of eligibility, approval, APR or rate. Verify the lender's final Key Facts Statement and contract before signing.
