# Construction Cost Control Dashboard — Portfolio Demo

Fictional Victorian residential project. No real clients/logos/compliance claims.

## Structure
- index.html — responsive single-page dashboard
- css/style.css
- js/app.js — calculations and filters
- data/project.json — one fictional project with variations, subcontractors, claims, budget categories
- tests/test_calcs.py — verifies revised value, exposure, receivables, commitments, warnings
- docs/test-results.md + screenshots/

## Calculation model
- Revised Contract = Original + Approved Variations
- Variation Exposure = Pending/Draft/Submitted totals
- Outstanding Receivables = Issued claims − Paid claims
- Outstanding Commitments = Committed − Paid
- Forecast Margin = Revised − Forecast Cost to Complete (committed + reserve estimate)

GST included; not tax/compliance advice.

## Run
Open `index.html` in a browser (local file). No server required.

## Tests
`python3 tests/test_calcs.py` — passes; reports over-budget categories and overdue claims.


## Financial Model (V1)
- Forecast Uncommitted Costs = 42,000 AUD (remaining contingency, landscaping, painting, final fixtures).
- All figures in AUD (GST included). No tax/compliance advice.
