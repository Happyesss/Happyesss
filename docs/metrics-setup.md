# Metrics Workflow Setup

Use this guide to finish configuring the automated full-year isometric commit calendar powered by [lowlighter/metrics](https://github.com/lowlighter/metrics).

## 1. Create a Personal Access Token

1. Visit <https://github.com/settings/tokens/new>.
2. Choose **Fine-grained token** (recommended) or **Classic token** if preferred.
3. Select the repository `Happyesss/Happyesss` (or your profile repository fork).
4. Grant the following permissions:
   - **Repository**: `Contents: Read and write` (required for committing the SVG)
   - **User**: `Read user` (optional, enables extra profile data)
5. Set an expiration that matches your rotation policy.
6. Copy the generated token value.

> ℹ️ Classic tokens need the `repo`, `read:user`, and `read:org` scopes to unlock every plugin capability.

## 2. Add the Token as a Secret

1. Open the repository settings at `Settings ▸ Secrets and variables ▸ Actions`.
2. Create a new secret named `METRICS_TOKEN`.
3. Paste the token value from the previous step and save.

## 3. Trigger the Workflow

- Push a commit to `main`, or
- Manually trigger from `Actions ▸ Generate metrics ▸ Run workflow`.

The action writes `metrics.plugin.isocalendar.fullyear.svg` at the repository root. The README already references this file, so it appears automatically after the first successful run.

## 4. Verify the Output

1. Inspect the workflow run logs to ensure the job completes without errors.
2. Confirm that the generated SVG exists at `https://raw.githubusercontent.com/Happyesss/Happyesss/main/metrics.plugin.isocalendar.fullyear.svg` (adjust branch if needed).
3. Refresh your GitHub profile README—it should now display the full-year isometric calendar under the "Isometric Calendar" section.

## Troubleshooting

- **Permission denied while committing**: Double-check the `METRICS_TOKEN` permissions or replace the token if it expired.
- **Calendar missing data**: Ensure the token belongs to the same user whose username is set in the workflow (`user: Happyesss`). Only public activity is available without additional scopes.
- **Time zone mismatch**: Adjust `config_timezone` in `.github/workflows/metrics.yml` to your preferred time zone.

Rotate your token periodically and retrigger the workflow whenever you change configuration options.
