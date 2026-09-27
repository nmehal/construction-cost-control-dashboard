# Construction Variation & Cost Control Dashboard

A portfolio demonstration of a lightweight construction project-financial-control dashboard for residential builders and renovation businesses.

This project uses fictional Victorian project data only. It is not connected to any real client, builder or subcontractor.

## Business Problem

Small builders and renovation businesses often track variations, subcontractor costs, progress claims and project budgets across separate spreadsheets, emails and notes.

That makes it difficult to quickly understand:

- the current contract value
- approved and pending variations
- subcontractor commitments
- amounts already paid
- outstanding progress claims
- forecast project margin
- budget overruns
- financial items requiring attention

This dashboard brings those items together in one project-control view.

## Features

### Project Summary
Displays:

- project name
- fictional client
- suburb
- project status
- start date
- target completion date
- original contract value
- revised contract value
- variation exposure
- forecast margin

### Variation Register
Tracks:

- variation ID
- description
- requested by
- variation value
- status
- approval date

Supports filtering by variation status.

### Subcontractor Cost Register
Tracks:

- trade
- subcontractor
- allowance
- committed amount
- paid amount
- outstanding amount
- status

Items where committed cost exceeds the original allowance are highlighted.

### Progress Claims
Tracks:

- claim number
- construction stage
- claim date
- claim amount
- status
- payment date

Outstanding receivables are calculated from issued and paid claims.

### Budget Control
Compares:

- original budget
- committed cost
- actual cost
- variance

Over-budget categories are highlighted.

### Warnings
The dashboard automatically identifies issues such as:

- cost categories where committed amounts exceed budget
- overdue progress claims

## Financial Model

The V1 calculations are:

**Revised Contract Value**

Original Contract Value + Approved Variations

**Variation Exposure**

Total of Pending, Draft and Submitted variations

**Outstanding Commitments**

Committed Costs - Paid Costs

**Outstanding Receivables**

Issued Claims - Paid Claims

**Forecast Cost to Complete**

Paid Costs + Outstanding Commitments + Forecast Uncommitted Costs

**Forecast Margin**

Revised Contract Value - Forecast Cost to Complete

**Forecast Margin %**

Forecast Margin / Revised Contract Value

The fictional project includes AUD 42,000 of forecast uncommitted costs representing remaining project expenditure not yet committed.

All figures are shown in Australian dollars. GST is included in the fictional dataset. This project does not provide tax, accounting or legal advice.

## Technology

- HTML
- CSS
- JavaScript
- JSON
- Python for calculation verification and tests

No database, authentication or backend is used in V1.

## Project Structure

```text
construction-cost-control-dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── data/
│   └── project.json
├── tests/
│   └── test_calcs.py
├── docs/
│   ├── test-results.md
│   └── screenshots/
└── README.md
