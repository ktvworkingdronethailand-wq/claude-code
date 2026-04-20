# KTV Finance & Invoicing — Agent Skills

**Agent ID:** `finance-invoicing`
**Team:** Revenue Operations
**Brain Layer:** Operational (Layer 1)

---

## Core Capabilities

| Skill | Action | Trigger |
|-------|--------|---------|
| Create Invoice | `create-invoice` | Data QA passed |
| Update Invoice Status | `update-invoice-status` | Payment received, overdue |
| Get Overdue Invoices | `get-overdue-invoices` | Every 900s scanner |
| Get Financial Summary | `get-financial-summary` | Daily ops, weekly report |

## Financial Rules (Hard-coded)

```
VAT:           7% (Thai VAT)
Royalty:       7% (KTV Group franchise fee)
Corporate Tax: 20%
Min Price:     27 THB/sqm (NEVER go below)
Min Order:     20,000 sqm
Payment Terms: Net 30 days
```

## Service Line Pricing

| Service | Price THB/sqm | Margin |
|---------|---------------|--------|
| Facade Cleaning | 30-35 | 77.7% |
| Window Cleaning | 32-38 | 74.2% |
| Solar Panel | 28-33 | 71.5% |
| Inspection | 25-40 | 69.8% |
| Thermal Imaging | 35-55 | 82.1% |
| Photogrammetry | 40-80 | 85.3% |

## Invoice Lifecycle

```
draft → sent → viewed → partial → paid → overdue → written-off
```

## Workflow Interactions

- **WORKFLOW_DELIVERY_TO_PAYMENT** step 2: creates invoice from job details
- **WORKFLOW_DELIVERY_TO_PAYMENT** step 3: marks invoice `sent`
- **WORKFLOW_OVERDUE_COLLECTION** step 1: pulls all overdue invoices
- **WORKFLOW_DAILY_OPS** step 5: morning financial summary

## Self-Improvement Loop

```
Every 900 seconds (Overdue Invoice Scanner):
  1. Flag invoices past due date
  2. Calculate days overdue per invoice
  3. Sort by amount × age (priority collection order)
  4. Emit `finance.invoice.overdue` for each
  5. Update EBITDA margin calculation
  6. Log: paid / overdue / gross revenue / net income
```

## Automation Triggers

- `finance.invoice.sent` → Gmail: invoice email to client
- `finance.invoice.overdue` → Gmail: payment reminder (CC Matthew)
- `finance.invoice.created` → emitted → downstream workflows

## Carbon Credit Revenue Stream

New revenue model from Climate Act integration:
- Each verified mission generates T-VER carbon credits
- Credits quantified: baseline emissions - drone emissions = credits
- Revenue: traded on Thailand Carbon Credit Exchange
- Booking: separate P&L line `carbon-credit-revenue`
- Reporting: annual TGO submission + client ESG report

## Year 1 Financial Targets

| Metric | Target |
|--------|--------|
| Gross Revenue | THB 180.18M |
| EBITDA Margin | ≥77.7% |
| Invoices DSO | ≤30 days |
| Overdue Rate | <5% |
| Carbon Credits | Active (new revenue line) |

## Key Metrics

| KPI | Target | Action if Off |
|-----|--------|---------------|
| EBITDA Margin | ≥77.7% | Review pricing + costs |
| DSO | ≤30 days | Tighten collection cadence |
| Overdue Amount | <5% of AR | Escalate to Matthew |
| Royalty Compliance | 100% | Never miss KTV Group payment |

## Decisions the Agent Makes Autonomously

1. **Price validation**: rejects line items below 27 THB/sqm
2. **Overdue escalation**: auto-assigns collection priority by amount × age
3. **VAT calculation**: applies 7% and formats Thai invoice correctly
4. **Revenue reconciliation**: matches paid invoices to jobs

---
_KTV Finance & Invoicing — Revenue Operations | Carbon Credit Ready_
