# DemonDash LocalStack Stack

This project uses LocalStack, Docker Compose, Terraform, and AWS CLI to run fake AWS resources locally for DemonDash.

## Required Tools

| Required | Why |
| --- | --- |
| Terraform | Creates the fake AWS resources through Infrastructure as Code |
| Docker | Runs LocalStack locally |
| Docker Compose | Starts/configures LocalStack from `docker-compose.yml` |
| LocalStack image | Simulates AWS locally; this project pins to `localstack/localstack:community-archive` |
| LocalStack Auth Token | Only required if you switch away from the archived community image and enable Pro |
| AWS CLI | Verifies resources against LocalStack |
| Terminal / PowerShell | Runs Docker, Terraform, AWS CLI, and Next.js commands |

## Setup

1. Run `npm run stack:up`.
2. If `.env` does not exist yet, the script will create it from `.env.example`.
3. The default `.env` points to `localstack/localstack:community-archive`, which avoids the newer auth-required image path.
4. If you want Pro features, switch `LOCALSTACK_IMAGE`, set `ACTIVATE_PRO=1`, and paste your token into `LOCALSTACK_AUTH_TOKEN`.
5. Start the full stack automatically:

```bash
npm run stack:up
```

6. Stop it when you are done:

```bash
npm run stack:down
```

7. If you also want Terraform resources destroyed on shutdown:

```bash
npm run stack:destroy
```

## What `stack:up` Does

`npm run stack:up` will:

1. check that Docker, Terraform, AWS CLI, curl, and npm exist
2. load `.env` or create it from `.env.example`
3. start LocalStack with Docker Compose
4. wait for `http://localhost:4566/_localstack/info`
5. run `terraform init`, `terraform validate`, and `terraform apply -auto-approve`
6. verify S3 and DynamoDB with AWS CLI
7. start the Next.js dev server on `http://127.0.0.1:3000`

## Manual Commands

If you want the lower-level commands individually:

```bash
npm run localstack:up
npm run tf:init
npm run tf:validate
npm run tf:apply
npm run aws:verify
npm run dev
```

## PowerShell Notes

If you need to use LocalStack Pro and want to set the token in the shell instead of `.env`:

```powershell
$env:LOCALSTACK_AUTH_TOKEN = "PASTE_TOKEN_HERE"
```

To create a quick S3 test file:

```powershell
"Bonjour LocalStack" | Out-File -FilePath test.txt -Encoding utf8
```

## Manual Setup Still Required

The automation does not remove these one-time/manual requirements:

- install Terraform on your machine
- have Docker running before `stack:up`
- if port `3000` is already occupied, free it or set `DEMONDASH_PORT`
- if you set `ACTIVATE_PRO=1`, provide a valid `LOCALSTACK_AUTH_TOKEN`

AWS CLI manual `aws configure` is usually not required for this project because the scripts inject fake LocalStack credentials directly.

## Created Resources

Terraform creates DemonDash-specific resources:

- `demondash-dev-exports`: S3 bucket for JSON/text export artifacts.
- `demondash-dev-projects`: DynamoDB table keyed by `project_id`.
- `demondash-dev-safety-events`: DynamoDB table keyed by `event_id`.

All clients are configured to use `http://localhost:4566`, not real AWS.
