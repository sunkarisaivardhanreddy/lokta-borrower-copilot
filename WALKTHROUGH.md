# 5-Minute Walkthrough — Lokta Borrower Copilot

## Demo order

1. Open the app.
2. Click **Priya**.
3. Explain the four output cards.
4. Open the Negotiation Card.
5. Return home and click **Ravi**.
6. Highlight the separate lender-style ceiling and collateral.
7. Return home and click **Anita**.
8. Highlight recent bounce + expensive debt + informal income and the Don't Borrow path.
9. Open `RULES.md` and show the assumption table.

## Talking points

### Priya
- Known score narrows rate adjustment.
- Salaried income uses a higher safe-affordability starting factor.
- Wedding is treated as discretionary: no future return is assumed.
- The safer amount is the decision anchor, not a lender's maximum.

### Ravi
- Self-employed income gets a more conservative safe factor.
- Collateral affects the indicative rate only; it is not a guarantee.
- Business borrowing can be productive, but projected returns are not counted as certain income.
- Compare secured/unsecured pricing and all-in fees.

### Anita
- Informal income, existing expensive debt and a recent bounce compound risk.
- The safe ceiling is deliberately conservative.
- The app can recommend Don't borrow rather than stretching the borrower to the requested amount.
- The stress case tests a 20% income drop.

## Live assumption-change follow-up

If asked to change an assumption live:
- Open `RULES.md`.
- Point to the relevant row.
- Change one value in `src/main.jsx`.
- Refresh and rerun the persona.
- Explain exactly which output changed and why.
