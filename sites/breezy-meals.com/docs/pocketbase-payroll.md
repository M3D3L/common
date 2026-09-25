# PocketBase payroll setup

The `/nomina` page requires a base collection named `payroll_entries`. Payroll
contains private compensation data and signatures, so every API rule must be
restricted to verified users.

## Recommended: generate an import file

The repository includes `pb_schema.staff-schedule.json`, currently the most
complete local schema snapshot. Generate the payroll import from it with:

```bash
npm run schema:payroll -- pb_schema.staff-schedule.json pb_schema.payroll.json
```

Then, in PocketBase, open **Settings -> Import collections** and import
`pb_schema.payroll.json`.

The generator preserves every existing collection and adds only
`payroll_entries`.

If production PocketBase has changed since the local snapshot was created,
first back up PocketBase and export its current collections schema. Save that
export in this directory and use its filename as the first command argument.

## Manual collection setup

Create a **Base collection** named `payroll_entries` with these fields:

| Field                | Type     | Required | Configuration                                      |
| -------------------- | -------- | -------- | -------------------------------------------------- |
| `employee`           | Relation | Yes      | Single relation to `users`                         |
| `period_start`       | Text     | Yes      | Date stored as `YYYY-MM-DD`                        |
| `period_end`         | Text     | Yes      | Date stored as `YYYY-MM-DD`                        |
| `pay_date`           | Text     | Yes      | Date stored as `YYYY-MM-DD`                        |
| `regular_hours`      | Number   | Yes      | Minimum `0`, decimals allowed                      |
| `overtime_hours`     | Number   | No       | Minimum `0`, decimals allowed                      |
| `hourly_rate`        | Number   | Yes      | Minimum `0`, decimals allowed                      |
| `gross_pay`          | Number   | Yes      | Minimum `0`, decimals allowed                      |
| `deductions`         | Number   | No       | Minimum `0`, decimals allowed                      |
| `net_pay`            | Number   | Yes      | Minimum `0`, decimals allowed                      |
| `payment_method`     | Select   | Yes      | `cash`, `transfer`, `check`, `other`               |
| `status`             | Select   | Yes      | `signed`, `paid`                                   |
| `notes`              | Text     | No       | Optional payroll notes                             |
| `acknowledgement`    | Text     | Yes      | Exact Spanish receipt statement shown when signing |
| `employee_signature` | File     | Yes      | One protected PNG, maximum 2 MB                    |
| `created_by`         | Relation | Yes      | Single relation to `users`                         |

Set all five API rules to exactly:

```text
@request.auth.verified = true
```

This applies to **List**, **View**, **Create**, **Update**, and **Delete**.

Add these indexes in the collection options:

```sql
CREATE UNIQUE INDEX `idx_payroll_employee_period`
ON `payroll_entries` (`employee`, `period_start`, `period_end`);

CREATE INDEX `idx_payroll_pay_date`
ON `payroll_entries` (`pay_date`);
```

The page calculates overtime at 1.5 times the hourly rate, calculates gross and
net pay, and stores the exact Spanish receipt statement displayed with the
signature. It reads, in part: "Al firmar, confirmo que recibí de Breezy Meals la
cantidad indicada... Mi firma sirve como recibo y constancia de pago."

Confirm that the wording and payroll fields meet your accountant's and local
labor requirements before using the records as formal payroll receipts.
