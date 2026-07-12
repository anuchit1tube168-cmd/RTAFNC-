# AGIS Processor v2

Apps Script backend for AGIS Grand Line Command Deck v5.1.

## New actions
- `output.save`
- `output.list`
- `chat.append`
- `chat.list`

Existing actions remain:
- `setup`
- `job.create`
- `job.route`
- `mission.update`
- `receipt.create`
- `dashboard.state`

## Script Properties
```text
SPREADSHEET_ID=1sMX_t9a2pYFGnSGi9ICmC4OTYNjJ7wE96bd3RQ-7yb0
OUTPUT_FOLDER_ID=1RhkFs7BRb1A9MBL7CumaTdtc1uNXX2w9
```

## Deploy
1. Open the State DB Google Sheet.
2. Extensions → Apps Script.
3. Replace `Code.gs` with `AGIS_Processor_v2_Code.gs`.
4. Add both Script Properties.
5. Deploy → Manage deployments → Edit.
6. Select **New version**.
7. Execute as **Me**.
8. Access: **Anyone**.
9. Deploy and authorize Google Sheets + Drive.

The existing `/exec` URL remains unchanged when updating the same deployment.

## Health check
Opening `/exec` must return:
```json
{
  "ok": true,
  "version": "2.0.0",
  "actions": ["output.save", "output.list", "chat.append", "chat.list"]
}
```

## Drive output package
`output.save` accepts a single file or a `files` array. The frontend sends:
- `index.html`
- `mission.json`
- `README.txt`
- `receipt.json` when a receipt exists

Files are stored under:
```text
08_AGIS_Outputs_Exports/<JOB-ID>/
```

Every saved file is logged in the `Outputs` sheet with File ID, URL, SHA-256, size and Draft/Final status.

## Shared chat
`chat.append` writes messages to the `Chat` sheet. `chat.list` returns the latest messages so desktop and mobile can see the same conversation.

## Hard gates
- Final Drive output requires Evidence URL or Receipt ID.
- Mission cannot become Done without Evidence.
- Receipt cannot be created without Evidence.
