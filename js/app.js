let data = null;

async function init() {
  const res = await fetch('data/project.json');
  data = await res.json();
  computeKPIs();
  renderSummary();
  renderVariations();
  renderSubs();
  renderClaims();
  renderBudget();
  renderWarnings();
}

function approvedVariations() {
  return data.variations.filter(v => v.status === 'Approved');
}
function pendingExposure() {
  return data.variations.filter(v => ['Pending','Draft','Submitted'].includes(v.status))
    .reduce((s,v)=>s+v.total,0);
}
function approvedTotal() {
  return approvedVariations().reduce((s,v)=>s+v.total,0);
}

function computeKPIs() {
  const revised = data.contract_value + approvedTotal();
  const committed = data.subcontractors.reduce((s,sc)=>s+sc.committed,0);
  const paid = data.budget_categories.reduce((s,b)=>s+b.actual,0); // paid = actual spent
  const paidClaims = data.claims.filter(c=>c.status==='Paid').reduce((s,c)=>s+c.amount,0);
  const issuedClaims = data.claims.filter(c=>['Paid','Issued','Overdue'].includes(c.status)).reduce((s,c)=>s+c.amount,0);
  const outstandingReceivables = issuedClaims - paidClaims;
  const outstandingCommit = committed - paid;
  const forecastCost = paid + outstandingCommit + (data.forecast_uncommitted_costs || 0);
  const forecastMargin = revised - forecastCost
  const forecastMarginPct = (forecastMargin / revised)*100;
  document.getElementById('k-contract').textContent = '$'+data.contract_value.toLocaleString();
  document.getElementById('k-revised').textContent = '$'+revised.toLocaleString();
  document.getElementById('k-exposure').textContent = '$'+pendingExposure().toLocaleString();
  document.getElementById('k-margin-pct').textContent = forecastMarginPct.toFixed(1)+'%';
  document.getElementById('k-receivables').textContent = '$'+outstandingReceivables.toLocaleString();
  document.getElementById('k-commitments').textContent = '$'+outstandingCommit.toLocaleString();
  document.getElementById('var-approved').textContent = approvedTotal().toLocaleString();
  document.getElementById('var-pending').textContent = pendingExposure().toLocaleString();
  document.getElementById('claim-receivables').textContent = outstandingReceivables.toLocaleString();
}

function renderSummary() {
  const revised = data.contract_value + approvedTotal();
  const committed = data.subcontractors.reduce((s,sc)=>s+sc.committed,0);
  const paid = data.budget_categories.reduce((s,b)=>s+b.actual,0);
  const outstandingCommit = committed - paid;
  const forecastCost = paid + outstandingCommit + (data.forecast_uncommitted_costs || 0);
  const forecastMargin = revised - forecastCost;

  const r = [
    ['Project', data.project_name],
    ['Client', data.client],
    ['Suburb', data.suburb],
    ['Status', data.status],
    ['Start Date', data.start_date],
    ['Target Completion', data.target_completion],
    ['Original Contract', '$'+data.contract_value.toLocaleString()],
    ['Revised Contract', '$'+revised.toLocaleString()],
    ['Variation Exposure', '$'+pendingExposure().toLocaleString()],
    ['Forecast Margin', '$'+forecastMargin.toLocaleString()],
  ];

  document.getElementById('summary-table').innerHTML =
    r.map(x=>`<tr><td>${x[0]}</td><td><strong>${x[1]}</strong></td></tr>`).join('');
}

function renderVariations() {
  const f = document.getElementById('var-filter').value;
  let rows = data.variations.filter(v => f==='All'||v.status===f);
  document.getElementById('var-table').innerHTML = '<tr><th>ID</th><th>Date</th><th>Desc</th><th>Status</th><th>Cost</th><th>Margin</th><th>Total</th></tr>' +
    rows.map(v=>`<tr><td>${v.id}</td><td>${v.date}</td><td>${v.description}</td><td>${v.status}</td><td>$${v.cost}</td><td>$${v.margin}</td><td><strong>$${v.total}</strong></td></tr>`).join('');
}
function renderSubs() {
  const f = document.getElementById('sub-filter').value;
  let list = data.subcontractors;
  if (f !== 'All') list = list.filter(s => s.trade === f);
  const opts = ['All', ...new Set(data.subcontractors.map(s=>s.trade))];
  document.getElementById('sub-filter').innerHTML = opts.map(o=>`<option>${o}</option>`).join('');
  document.getElementById('sub-table').innerHTML = '<tr><th>Trade</th><th>Name</th><th>Scope</th><th>Committed</th><th>Paid</th><th>Outstanding</th><th>Status</th></tr>' +
    list.map(s=>`<tr><td>${s.trade}</td><td>${s.name}</td><td>${s.scope}</td><td>$${s.committed}</td><td>$${s.paid}</td><td>$${s.committed-s.paid}</td><td>${s.status}</td></tr>`).join('');
}
function renderClaims() {
  const f = document.getElementById('claim-filter').value;
  let rows = data.claims.filter(c => f==='All'||c.status===f);
  document.getElementById('claim-table').innerHTML = '<tr><th>No.</th><th>Stage</th><th>Date</th><th>Amount</th><th>Status</th><th>Paid Date</th></tr>' +
    rows.map(c=>`<tr><td>${c.no}</td><td>${c.stage}</td><td>${c.date}</td><td>$${c.amount}</td><td><strong>${c.status}</strong></td><td>${c.paid_date||'-'}</td></tr>`).join('');
}
function renderBudget() {
  document.getElementById('budget-table').innerHTML = '<tr><th>Category</th><th>Budget</th><th>Committed</th><th>Actual</th><th>Over</th></tr>' +
    data.budget_categories.map(b=>`<tr><td>${b.category}</td><td>$${b.budget}</td><td>$${b.committed}</td><td>$${b.actual}</td><td>${(b.committed-b.budget)>0?'<strong style="color:#c33">+$'+(b.committed-b.budget)+'</strong>':''}</td></tr>`).join('');
}
function renderWarnings() {
  const w = [];
  // Over-budget categories
  data.budget_categories.forEach(b=>{ if(b.committed>b.budget) w.push('Over budget: '+b.category+' (committed $'+b.committed+' vs budget $'+b.budget+')'); });
  // Overdue claims
  data.claims.filter(c=>c.status==='Overdue').forEach(c=>w.push('Overdue claim: '+c.no+' '+c.stage+' — $'+c.amount));
  // Old pending variations (>30 days approx using date strings)
  document.getElementById('warnings-list').innerHTML = w.map(x=>'<li>'+x+'</li>').join('');
}
function showTab(id) {
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  event.target.classList.add('active');
}
init();
