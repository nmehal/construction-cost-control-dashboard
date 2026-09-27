#!/usr/bin/env python3
import json, sys
sys.path.insert(0, '.')
with open('data/project.json') as f:
    data = json.load(f)

approved = [v for v in data['variations'] if v['status']=='Approved']
revised = data['contract_value'] + sum(v['total'] for v in approved)
committed = sum(sc['committed'] for sc in data['subcontractors'])
paid = sum(b['actual'] for b in data['budget_categories'])
paid_claims = sum(c['amount'] for c in data['claims'] if c['status']=='Paid')
issued_claims = sum(c['amount'] for c in data['claims'] if c['status'] in ('Paid','Issued','Overdue'))
receivables = issued_claims - paid_claims
pending_exp = sum(v['total'] for v in data['variations'] if v['status'] in ('Pending','Draft','Submitted'))
outstanding_commit = committed - paid

forecast_uncommitted = data.get('forecast_uncommitted_costs', 0)
forecast_cost = paid + outstanding_commit + forecast_uncommitted
forecast_margin = revised - forecast_cost
forecast_margin_pct = (forecast_margin / revised) * 100

print('Forecast inputs: uncommitted=', forecast_uncommitted)
print('Paid=', paid)
print('Outstanding Commitments=', outstanding_commit)
print('Forecast Cost to Complete=', forecast_cost)
print('Forecast Margin=', forecast_margin)
print('Forecast Margin %=', round(forecast_margin_pct, 1))

assert forecast_uncommitted == 42000
assert pending_exp >= 0
assert receivables >= 0
assert outstanding_commit >= 0
assert revised > data['contract_value']
print('All checks passed.')
