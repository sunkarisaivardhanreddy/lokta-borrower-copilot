import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft, ArrowRight, Check, Clipboard, CreditCard, IndianRupee,
  Info, RotateCcw, ShieldCheck, Sparkles, TrendingDown, WalletCards
} from "lucide-react";
import "./styles.css";

const INR = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

const PERSONAS = {
  priya: {
    name: "Priya",
    subtitle: "29 · Bengaluru · salaried",
    answers: {
      purpose: "Wedding",
      loanType: "Personal",
      amount: 800000,
      income: 110000,
      incomeType: "Salaried",
      existingEmi: 14000,
      expenses: 28000,
      age: 29,
      scoreKnown: "Yes",
      score: 780,
      stability: "Stable",
      variableShare: 10,
      savings: 300000,
      bounced: "No",
      expensiveDebt: "No",
      productiveReturn: "No",
      offerRate: 12,
      fee: 8000
    }
  },
  ravi: {
    name: "Ravi",
    subtitle: "42 · Mysuru · self-employed",
    answers: {
      purpose: "Stock + delivery vehicle",
      loanType: "Business",
      amount: 1500000,
      income: 75000,
      incomeType: "Self-employed",
      existingEmi: 0,
      expenses: 42000,
      age: 42,
      scoreKnown: "No",
      score: "",
      stability: "Moderate",
      variableShare: 45,
      savings: 250000,
      bounced: "No",
      expensiveDebt: "No",
      collateral: "Yes",
      productiveReturn: "Yes",
      offerRate: 12.5,
      fee: 15000
    }
  },
  anita: {
    name: "Anita",
    subtitle: "35 · Hubballi · informal",
    answers: {
      purpose: "Electric scooter for delivery",
      loanType: "Two-wheeler",
      amount: 150000,
      income: 28000,
      incomeType: "Informal",
      existingEmi: 3500,
      expenses: 18000,
      age: 35,
      scoreKnown: "No",
      score: "",
      stability: "Unstable",
      variableShare: 25,
      savings: 10000,
      bounced: "Yes",
      expensiveDebt: "Yes",
      existingDebt: 35000,
      productiveReturn: "Yes",
      offerRate: 30,
      fee: 4500
    }
  }
};

const BASE = {
  Personal: 12,
  Business: 12.5,
  "Two-wheeler": 12.5,
  Home: 8.5,
  "Loan against property": 10.5,
  Gold: 10
};

const TENURE = {
  Personal: 60,
  Business: 84,
  "Two-wheeler": 48,
  Home: 240,
  "Loan against property": 180,
  Gold: 36
};

const SAFE_FACTOR = { Salaried: 0.45, "Self-employed": 0.40, Informal: 0.35 };
const LENDER_FOIR = { Salaried: 0.50, "Self-employed": 0.45, Informal: 0.40 };

function emi(principal, annualRate, months) {
  if (!principal || !months) return 0;
  const r = annualRate / 1200;
  if (!r) return principal / months;
  return principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
}

function principalForEmi(monthlyEmi, annualRate, months) {
  if (!monthlyEmi || !months) return 0;
  const r = annualRate / 1200;
  if (!r) return monthlyEmi * months;
  return monthlyEmi * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
}

function fmt(n) { return `₹${INR.format(Math.max(0, Math.round(n || 0)))}`; }

function calculate(a) {
  const income = Number(a.income) || 0;
  const requested = Number(a.amount) || 0;
  const existing = Number(a.existingEmi) || 0;
  const expenses = Number(a.expenses) || 0;
  const savings = Number(a.savings) || 0;
  const fee = Number(a.fee) || 0;
  const offer = Number(a.offerRate) || 0;
  const tenure = TENURE[a.loanType] || 60;

  let fair = BASE[a.loanType] || 12;
  const score = Number(a.score);
  if (a.scoreKnown === "Yes") {
    if (score >= 800) fair -= 0.75;
    else if (score >= 750) fair -= 0.25;
    else if (score >= 700) fair += 0.5;
    else if (score >= 650) fair += 1.5;
    else fair += 2.5;
  } else fair += 1;
  if (a.incomeType === "Self-employed") fair += 0.75;
  if (a.incomeType === "Informal") fair += 1.5;
  if (a.stability === "Unstable") fair += 0.75;
  if (a.bounced === "Yes") fair += 2;
  if (a.collateral === "Yes") fair -= 1;

  const low = Math.max(6, fair - 1);
  const high = Math.min(30, fair + 1.5);
  const midpoint = (low + high) / 2;

  let safeFactor = SAFE_FACTOR[a.incomeType] || 0.40;
  if (savings < income * 2) safeFactor -= 0.02;
  if (a.bounced === "Yes") safeFactor -= 0.05;
  if (a.expensiveDebt === "Yes") safeFactor -= 0.05;
  if (a.stability === "Unstable") safeFactor -= 0.03;
  safeFactor = Math.max(0.22, safeFactor);

  const safeEmi = Math.max(0, income * safeFactor - existing);
  const lenderEmi = Math.max(0, income * (LENDER_FOIR[a.incomeType] || 0.45) - existing);
  const safeAmount = principalForEmi(safeEmi, midpoint, tenure);
  const lenderAmount = principalForEmi(lenderEmi, midpoint, tenure);

  let verdict = "borrow";
  let headline = "Borrow";
  let reasons = [];

  if (income <= 0 || requested <= 0) {
    verdict = "dont"; headline = "Don't borrow"; reasons.push("There is not enough verified cash-flow information to support a responsible borrowing decision.");
  } else if (a.bounced === "Yes" && a.expensiveDebt === "Yes" && requested > safeAmount * 0.75) {
    verdict = "dont"; headline = "Don't borrow"; reasons.push("A recent bounce plus expensive existing debt makes new borrowing especially fragile right now.");
  } else if (requested > safeAmount) {
    verdict = "less"; headline = "Borrow less"; reasons.push(`The requested ${fmt(requested)} is above the estimated safe amount of ${fmt(safeAmount)}.`);
  } else if (a.bounced === "Yes" || a.expensiveDebt === "Yes") {
    verdict = "less"; headline = "Borrow less"; reasons.push("Existing repayment stress reduces the amount that should be taken on even if a lender might approve more.");
  } else {
    reasons.push("The requested amount fits within the estimated cash-flow ceiling under the stated assumptions.");
  }

  if (expenses > income * 0.55) reasons.push("Household expenses already consume a large share of monthly income.");
  if (requested > lenderAmount) reasons.push("The request is also above the indicative lender-style ceiling.");
  if (a.productiveReturn === "Yes") reasons.push("The stated purpose may generate income, but the return is not treated as guaranteed.");
  if (a.productiveReturn === "No") reasons.push("The purpose is discretionary, so the safer test is whether the EMI remains comfortable without relying on future income.");

  const allIn = offer > 0 ? offer + (fee / Math.max(1, requested)) * (12 / Math.max(1, tenure / 12)) * 100 : midpoint;
  const quotedRate = offer > 0 ? offer : midpoint;
  const apr = offer > 0 ? allIn : midpoint + (fee / Math.max(1, requested)) * (12 / Math.max(1, tenure / 12)) * 100;
  const stressIncome = income * 0.8;
  const stressEmi = Math.max(0, stressIncome * safeFactor - existing);
  const stressAmount = principalForEmi(stressEmi, midpoint, tenure);
  const stressRequestedEmi = emi(requested, quotedRate, tenure);
  const requestedEmi = emi(requested, quotedRate, tenure);

  const answeredAdaptive = ["stability","savings","bounced","expensiveDebt","productiveReturn"].filter(k => a[k] !== undefined && a[k] !== "").length;
  const confidence = answeredAdaptive >= 4 ? "Higher" : answeredAdaptive >= 2 ? "Medium" : "Wider";
  const bandMultiplier = confidence === "Higher" ? 1 : confidence === "Medium" ? 1.12 : 1.25;

  return {
    ...a, requested, fairLow: low, fairHigh: high, midpoint, quotedRate, apr,
    tenure, safeEmi, lenderEmi, safeAmount, lenderAmount, verdict, headline, reasons,
    requestedEmi, stressIncome, stressEmi, stressAmount, stressRequestedEmi,
    confidence, safeRangeLow: safeAmount / bandMultiplier, safeRangeHigh: safeAmount * bandMultiplier,
    lenderRangeLow: lenderAmount / bandMultiplier, lenderRangeHigh: lenderAmount * bandMultiplier,
    whySafe: `${Math.round(safeFactor*100)}% of net income is the starting affordability factor for ${a.incomeType || "this profile"}, then existing EMI and repayment-risk signals reduce it.`,
    whyLender: `${Math.round((LENDER_FOIR[a.incomeType] || .45)*100)}% FOIR-style ceiling less existing EMI, used only as an indicative sanction-style estimate.`,
    whyRate: `Base rate for ${a.loanType || "the selected product"} plus adjustments for score knowledge/risk, income stability, bounce history and collateral.`,
    whyApr: "APR-style disclosure adds the stated processing fee to the interest-rate view; actual lender APR must be verified from the final sanction/KFS.",
    whyEmi: `EMI uses the requested amount, indicative rate and a ${tenure}-month reference tenure.`
  };
}

const mandatory = [
  ["purpose", "What is the loan for?", ["Wedding", "Medical", "Education", "Home improvement", "Business", "Vehicle", "Other"]],
  ["loanType", "What type of loan?", ["Personal", "Business", "Two-wheeler", "Home", "Loan against property", "Gold"]],
  ["amount", "How much do you want to borrow?", "number"],
  ["income", "What is your monthly net income?", "number"],
  ["incomeType", "How do you earn?", ["Salaried", "Self-employed", "Informal"]],
  ["existingEmi", "How much do you already pay in EMIs each month?", "number"],
  ["expenses", "Monthly household essentials (rent, food, utilities, etc.)?", "number"],
  ["age", "Your age?", "number"],
  ["scoreKnown", "Do you know your credit score?", ["Yes", "No"]],
];

function questionsFor(a) {
  const q = [...mandatory];
  if (a.scoreKnown === "Yes") q.push(["score", "What is your credit score?", "number"]);
  if (a.incomeType === "Salaried") q.push(["stability", "How stable is your income?", ["Stable", "Moderate", "Unstable"]]);
  if (a.incomeType === "Self-employed") {
    q.push(["stability", "How stable is your business income?", ["Stable", "Moderate", "Unstable"]]);
    q.push(["collateral", "Do you have suitable collateral you could use?", ["Yes", "No"]]);
  }
  if (a.incomeType === "Informal") q.push(["stability", "How stable is your income?", ["Stable", "Moderate", "Unstable"]]);
  q.push(["savings", "How much emergency savings do you have?", "number"]);
  q.push(["bounced", "Any EMI/payment bounce in the last 3 months?", ["Yes", "No"]]);
  q.push(["expensiveDebt", "Do you have high-cost/app/card debt you are repaying?", ["Yes", "No"]]);
  q.push(["productiveReturn", "Will this borrowing directly generate or protect income?", ["Yes", "No", "Not sure"]]);
  q.push(["offerRate", "Do you already have a lender rate offer? (optional)", "number"]);
  q.push(["fee", "Processing/other upfront fee on that offer? (optional)", "number"]);
  return q;
}

function App() {
  const [answers, setAnswers] = useState({});
  const [mode, setMode] = useState("home");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const qs = useMemo(() => questionsFor(answers), [answers]);

  function start() { setMode("questions"); setStep(0); setResult(null); }
  function choose(key, value) { setAnswers(x => ({...x, [key]: value})); }
  function next() {
    if (step < qs.length - 1) setStep(step + 1);
    else { const r = calculate(answers); setResult(r); setMode("result"); }
  }
  function back() { if (step > 0) setStep(step - 1); else setMode("home"); }
  function loadPersona(key) {
    const a = {...PERSONAS[key].answers};
    setAnswers(a); setResult(calculate(a)); setMode("result"); setCopied(false);
  }
  function reset() { setAnswers({}); setResult(null); setMode("home"); setStep(0); }

  if (mode === "home") return (
    <main className="shell">
      <header className="top"><div className="brand"><Sparkles size={18}/> LOKTA / BORROWER COPILOT</div><span className="tag">LOCAL-FIRST · NO LOGIN</span></header>
      <section className="hero">
        <div>
          <p className="eyebrow">A practical borrowing decision assistant for India</p>
          <h1>Should you borrow,<br/><em>how much, and at what cost?</em></h1>
          <p className="lede">Answer only what changes the decision. The copilot separates a lender-style ceiling from a safer personal ceiling, explains every major number, stress-tests the EMI, and creates a one-page Negotiation Card.</p>
          <button className="primary" onClick={start}>Start assessment <ArrowRight size={18}/></button>
        </div>
        <div className="hero-card">
          <ShieldCheck size={28}/>
          <h3>Designed for the challenge brief</h3>
          <ul><li>No login or bureau pull</li><li>No personal data storage</li><li>India / ₹ / FOIR-style affordability</li><li>Fewer answers → wider confidence</li></ul>
        </div>
      </section>
      <section className="demo">
        <div className="section-head"><div><p className="eyebrow">Demo mode</p><h2>Three required borrower run-throughs</h2></div><p>Load a persona to inspect the complete output without re-entering data.</p></div>
        <div className="persona-grid">
          {Object.entries(PERSONAS).map(([k,p]) => <button className="persona" key={k} onClick={() => loadPersona(k)}>
            <span>{p.name}</span><strong>{p.subtitle}</strong><small>{k==="priya"?"Salaried + wedding":k==="ravi"?"Business + collateral":"Informal + existing debt"}</small>
          </button>)}
        </div>
      </section>
      <footer><span>Lokta Borrower Copilot · Challenge submission build</span><button className="linkbtn" onClick={() => window.open("RULES.md","_blank")}>Rules & assumptions</button></footer>
    </main>
  );

  if (mode === "questions") {
    const [key, prompt, kind] = qs[step];
    const value = answers[key] ?? "";
    const answered = value !== "";
    return <main className="shell compact">
      <header className="top"><div className="brand"><Sparkles size={18}/> BORROWER COPILOT</div><button className="ghost" onClick={reset}><RotateCcw size={16}/> Start over</button></header>
      <div className="progress"><span style={{width:`${((step+1)/qs.length)*100}%`}}/></div>
      <section className="question">
        <p className="eyebrow">Question {step+1} of {qs.length}</p>
        <h1>{prompt}</h1>
        {kind === "number" ? <div className="number-wrap"><IndianRupee size={22}/><input autoFocus type="number" value={value} onChange={e=>choose(key,e.target.value)} placeholder="Enter amount"/></div> :
          <div className="options">{kind.map(v=><button className={value===v?"option selected":"option"} key={v} onClick={()=>choose(key,v)}><span>{value===v?<Check size={17}/>:null}</span>{v}</button>)}</div>}
        {key==="score" && <p className="hint"><Info size={15}/> If you don't know it, choose “No” on the previous question. Unknown scores never become 0 or 300.</p>}
        {(key==="offerRate" || key==="fee") && <p className="hint"><Info size={15}/> Optional — leave blank if you do not have an offer. It will not block the assessment.</p>}
        <div className="nav"><button className="ghost" onClick={back}><ArrowLeft size={16}/> Back</button><button className="primary" disabled={!answered && !["offerRate","fee"].includes(key)} onClick={next}>{step===qs.length-1?"See my decision":"Continue"} <ArrowRight size={16}/></button></div>
      </section>
    </main>;
  }

  const r = result;
  const cardText = `LOKTA NEGOTIATION CARD
Decision: ${r.headline}
Purpose: ${r.purpose}
Requested: ${fmt(r.requested)}
Safer ceiling: ${fmt(r.safeAmount)}
Indicative lender-style ceiling: ${fmt(r.lenderAmount)}
Fair rate band: ${r.fairLow.toFixed(1)}%–${r.fairHigh.toFixed(1)}%
All-in APR-style view: ${r.apr.toFixed(1)}%
Reference tenure: ${r.tenure} months
Estimated EMI at offered/indicative rate: ${fmt(r.requestedEmi)}
Stress EMI capacity (20% income drop): ${fmt(r.stressEmi)}
Ask lender: confirm APR/KFS, fee, prepayment/late charges, and final EMI in writing.
Confidence: ${r.confidence} — ${r.confidence==="Wider"?"some decision-changing inputs are missing.": "adaptive inputs support this estimate."}`;

  async function copyCard() { try { await navigator.clipboard.writeText(cardText); setCopied(true); setTimeout(()=>setCopied(false),1800); } catch {} }

  return <main className="shell">
    <header className="top"><div className="brand"><Sparkles size={18}/> LOKTA / BORROWER COPILOT</div><div className="top-actions"><button className="ghost" onClick={start}><RotateCcw size={16}/> New assessment</button></div></header>
    <section className="result-head">
      <div><p className="eyebrow">Decision output</p><h1>{r.headline}</h1><p>{r.reasons[0]}</p></div>
      <div className={`decision ${r.verdict}`}><span>Decision</span><strong>{r.headline}</strong><small>{r.confidence} confidence</small></div>
    </section>

    <section className="grid4">
      <article className="panel"><div className="panel-title"><WalletCards/><span>O1 · Borrowing decision</span></div><h2>{r.headline}</h2>{r.reasons.map((x,i)=><p className="reason" key={i}>• {x}</p>)}<div className="mini-note"><strong>Why:</strong> {r.whySafe}</div></article>
      <article className="panel"><div className="panel-title"><CreditCard/><span>O2 · Two ceilings</span></div><div className="metric"><span>Safer amount</span><strong>{fmt(r.safeAmount)}</strong></div><p className="why">{r.whySafe}</p><div className="metric"><span>Indicative lender-style</span><strong>{fmt(r.lenderAmount)}</strong></div><p className="why">{r.whyLender}</p><div className="callout">Use the <b>safer amount</b> for your decision. A lender may sanction more; that is not proof it is affordable.</div></article>
      <article className="panel"><div className="panel-title"><TrendingDown/><span>O3 · Fair cost</span></div><div className="rate">{r.fairLow.toFixed(1)}%–{r.fairHigh.toFixed(1)}%</div><p>Indicative fair annual rate band.</p><div className="metric"><span>All-in APR-style view</span><strong>{r.apr.toFixed(1)}%</strong></div><p className="why">{r.whyRate} {r.whyApr}</p></article>
      <article className="panel"><div className="panel-title"><IndianRupee/><span>O4 · EMI & stress</span></div><div className="metric"><span>Monthly EMI</span><strong>{fmt(r.requestedEmi)}</strong></div><p className="why">{r.whyEmi}</p><div className="metric"><span>Safer EMI ceiling</span><strong>{fmt(r.safeEmi)}</strong></div><div className="stress"><b>Stress case:</b> if income falls 20%, estimated comfortable EMI falls to {fmt(r.stressEmi)}. The requested EMI is {r.stressRequestedEmi > r.stressEmi ? "above" : "within"} that stressed capacity.</div></article>
    </section>

    <section className="range-row">
      <div className="range-card"><span>Safe amount confidence range</span><strong>{fmt(r.safeRangeLow)} – {fmt(r.safeRangeHigh)}</strong><small>Fewer adaptive answers widen the estimate. This is not a lender commitment.</small></div>
      <div className="range-card"><span>Reference tenure trade-off</span><strong>{r.tenure} months</strong><small>Longer tenure lowers EMI but increases total interest; shorter tenure does the opposite.</small></div>
    </section>

    <section className="card-section">
      <div className="card-copy"><p className="eyebrow">One-page output</p><h2>Negotiation Card</h2><p>Take these numbers to the lender and ask for the final cost in writing.</p></div>
      <div className="negotiation">
        <div className="neg-head"><span>LOKTA / NEGOTIATION CARD</span><span>INDIA · ₹</span></div>
        <div className="neg-decision"><small>RECOMMENDATION</small><h2>{r.headline}</h2><p>{r.purpose} · Requested {fmt(r.requested)}</p></div>
        <div className="neg-grid"><div><small>SAFE CEILING</small><b>{fmt(r.safeAmount)}</b></div><div><small>LENDER-STYLE</small><b>{fmt(r.lenderAmount)}</b></div><div><small>FAIR RATE</small><b>{r.fairLow.toFixed(1)}–{r.fairHigh.toFixed(1)}%</b></div><div><small>EMI</small><b>{fmt(r.requestedEmi)}</b></div></div>
        <div className="ask"><b>Ask before signing</b><span>Final APR / KFS · processing fee · insurance · late/penal charges · prepayment terms · exact EMI & tenure</span></div>
        <button className="primary full" onClick={copyCard}><Clipboard size={16}/> {copied?"Copied":"Copy Negotiation Card"}</button>
      </div>
    </section>

    <section className="details">
      <details><summary>Show calculation assumptions & why each number exists</summary><div className="detail-grid">
        <p><b>Safe amount</b><br/>{r.whySafe}</p><p><b>Lender-style amount</b><br/>{r.whyLender}</p><p><b>Rate band</b><br/>{r.whyRate}</p><p><b>APR-style view</b><br/>{r.whyApr}</p><p><b>EMI</b><br/>{r.whyEmi}</p><p><b>Limit</b><br/>These are indicative planning estimates, not a sanction, APR certificate, credit decision, or financial advice. Final lender terms and Key Facts Statement control.</p>
      </div></details>
    </section>
    <footer><span>Local-only rules engine · No bureau pull · No data persistence</span><button className="linkbtn" onClick={reset}>Return home</button></footer>
  </main>;
}

createRoot(document.getElementById("root")).render(<App />);
