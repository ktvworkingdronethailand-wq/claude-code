# Airtable Schema — One Bangkok Project Tracker

Use this schema to create tables in Airtable for full project tracking.

---

## Table 1: Master Task Tracker

| Field | Type | Options |
|-------|------|---------|
| Task ID | Auto Number | — |
| Task Name | Single Line Text | — |
| Team | Single Select | Growth, Delivery, Compliance, Intelligence, Ecosystem, Revenue |
| Agent | Single Select | market_intelligence, partner_strategy, financial_model, deal_design, operations_compliance, smart_green, sales_playbook |
| Status | Single Select | Not Started, In Progress, Blocked, Complete |
| Priority | Single Select | P0 Critical, P1 High, P2 Medium, P3 Low |
| Owner | Single Select | Matthew, Por (Thanvarat), Krit |
| Due Date | Date | — |
| Dependencies | Link to Another Record | (self-referencing) |
| Notes | Long Text | — |

### Seed Data

| Task | Team | Priority | Owner | Due |
|------|------|----------|-------|-----|
| Engage CAAT aviation lawyer | Compliance | P0 | Matthew | 8 Apr |
| Submit joint proposal to IFS | Growth | P0 | Matthew + Por | 16 Apr |
| Get enhanced insurance quotes (THB 50M+) | Compliance | P1 | Krit | 16 Apr |
| Request One Bangkok site survey access | Delivery | P1 | Por | 16 Apr |
| Finalize pitch deck for design | Growth | P2 | Matthew | 14 Apr |
| File CAAT altitude waiver application | Compliance | P2 | Krit + Lawyer | 15 May |
| Prepare Thai-language executive summary | Growth | P2 | Por | 14 Apr |
| IFS integration sandbox demo | Ecosystem | P2 | Matthew | 23 Apr |

## Table 2: Stakeholder Map

| Field | Type |
|-------|------|
| Name | Single Line Text |
| Organization | Single Select | One Bangkok, TCC Group, IFS Thailand, PCS Thailand, KTV |
| Role | Single Line Text |
| Decision Authority | Single Select | Approver, Influencer, Gatekeeper, User |
| Key Concern | Long Text |
| Relationship Status | Single Select | Not Met, Introduced, Building, Strong |
| Contact Email | Email |
| Last Contact | Date |
| Next Action | Single Line Text |

## Table 3: Financial Guardrails

| Field | Type |
|-------|------|
| Guardrail | Single Line Text |
| Threshold | Single Line Text |
| One Bangkok Value | Single Line Text |
| Status | Single Select | PASS, FAIL, AT RISK |

## Table 4: Timeline & Milestones

| Field | Type |
|-------|------|
| Milestone | Single Line Text |
| Phase | Single Select | Pre-Proposal, Proposal, Pilot, Negotiation, Contract |
| Target Week | Number |
| Target Date | Date |
| Status | Single Select | Upcoming, Active, Complete, Delayed |
| Blocker | Long Text |

---

*Import this schema into Airtable to create the One Bangkok project tracker*
