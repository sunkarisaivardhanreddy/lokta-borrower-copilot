# Lokta Borrower Copilot — Rules & Assumptions

## Purpose
This document makes the decision logic inspectable. It separates challenge-required judgement from factual product/regulatory concepts that should be verified against the lender's final documents.

| What | Value / rule | Why | Source / judgement |
|---|---|---|---|
| Safe affordability factor | Salaried 45%, self-employed 40%, informal 35% of net monthly income, less existing EMI | Conservative planning ceiling rather than maximum approval | **My judgement** |
| Risk reductions | -2 percentage points for low emergency savings, -5 pp for recent bounce, -5 pp for expensive debt, -3 pp for unstable income | Makes fragile cash-flow reduce the safe ceiling | **My judgement** |
| Lender-style FOIR | Salaried 50%, self-employed 45%, informal 40%, less existing EMI | Gives a separate indicative sanction-style ceiling | **My judgement; not a lender policy** |
| Unknown credit score | Adds 1 pp to rate estimate; never maps unknown to 0/300 | Missing information should widen uncertainty, not create a fake score | **My judgement** |
| Score adjustments | 800+: -0.75 pp; 750–799: -0.25; 700–749: +0.5; 650–699: +1.5; <650: +2.5 | Makes the rate estimate responsive to known credit quality | **My judgement** |
| Income-type adjustments | Self-employed +0.75 pp; informal +1.5 pp | Reflects uncertainty in cash-flow documentation | **My judgement** |
| Stability / bounce | Unstable +0.75 pp; recent bounce +2 pp | Higher repayment risk should increase indicative rate | **My judgement** |
| Collateral | -1 pp when suitable collateral is stated | Secured borrowing can reduce pricing risk, subject to lender/product | **My judgement** |
| Base rates | Personal 12%; Business 12.5%; Two-wheeler 12.5%; Home 8.5%; LAP 10.5%; Gold 10% | Reference starting points for the prototype | **My judgement / illustrative market bands** |
| Fair rate band | Base + profile adjustments, then -1 to +1.5 pp | Produces a negotiation range rather than a single fake-precision rate | **My judgement** |
| Safe amount | Principal supported by safe EMI at midpoint rate and reference tenure | Converts affordability into a rupee ceiling | **My judgement** |
| Lender-style amount | Principal supported by lender-style EMI at midpoint rate and reference tenure | Separates possible approval from comfortable affordability | **My judgement** |
| Reference tenure | Personal 60m; Business 84m; Two-wheeler 48m; Home 240m; LAP 180m; Gold 36m | Needed to make amount/EMI calculations concrete | **My judgement** |
| EMI | Standard reducing-balance amortisation formula | Transparent mathematical calculation | **Calculation** |
| Stress case | 20% income reduction | Tests whether EMI survives a plausible adverse month | **My judgement** |
| Confidence | More adaptive answers = narrower range; fewer = wider range | Prevents false precision | **My judgement** |
| Processing fee | Added to the rate view as an APR-style estimate | Helps borrower compare all-in cost | **Prototype approximation** |
| Final APR / KFS | Must be verified in final lender documentation | The prototype is not a lender APR certificate | **Product/regulatory principle; verify current lender documents** |

## Product principles

1. **No login, bureau pull or persistent personal-data store.** The challenge explicitly calls for user-provided inputs only.
2. **Adaptive questioning.** The app starts with core questions and adds questions only when they can change the output.
3. **Unknown is not zero.** Unknown credit score stays unknown and increases uncertainty.
4. **Borrow less is a first-class outcome.** The app can recommend Borrow, Borrow less, or Don't borrow.
5. **Sanction is not affordability.** The safer amount is the primary decision anchor.
6. **Every major number has a visible “why”.**
7. **The final lender's Key Facts Statement / contract controls.** Prototype calculations are planning estimates, not financial advice.

## APR note
The prototype uses an APR-style fee adjustment so a borrower can see that a processing fee raises the all-in cost. It is intentionally labelled an estimate. A production implementation should replace this with an exact lender/KFS APR calculation using the actual cash-flow dates, fees, insurance and disbursement mechanics.

## Limitations
- No lender underwriting policy is guaranteed.
- No credit-bureau data is pulled.
- No guarantee of approval, rate, or eligibility.
- Informal-income treatment is intentionally conservative.
- Business returns are not treated as guaranteed future cash flow.
