# 🎬 TheBigVon: Second Coming

A cutting-edge AI-powered storytelling engine that generates dynamic, narrative-driven content for social media. TheBigVon creates engaging skits and scripts with multiple generation modes, safety guardrails, and flexible export formats.

## 🚀 Features

- **Multiple Generation Modes**: 5 unique storytelling scenarios (Hellcat Demon, Fake Plug, Friend Weird, Rental Flex, Court Panic)
- **Dynamic Scene Generation**: AI-powered creation of engaging narrative beats with customizable chaos levels
- **Safety & Content Filtering**: Built-in safety mechanisms with intelligent rewriting of potentially problematic content
- **Flexible Export Formats**: Generate content in multiple formats:
  - TikTok Skits
  - Case Files
  - Caption Packs
  - Narrator Scripts
  - Reels Captions
  - Shorts Scripts
- **Project Dashboard**: Track and manage generated projects with visual statistics
- **Cloud Storage**: AWS S3 integration for reliable project storage
- **Infrastructure as Code**: Terraform configuration for easy deployment

## 🛠️ Tech Stack

- **Frontend**: React 19 + Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **Backend**: Next.js API Routes (TypeScript)
- **Cloud Services**:
  - AWS S3 (Project Storage)
  - AWS DynamoDB (Project Metadata)
- **Infrastructure**: Terraform + LocalStack (for local development)
- **UI Components**: Lucide React Icons
- **Development**: ESLint, TypeScript Strict Mode

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- AWS Account (with credentials configured locally)
- Docker & Docker Compose (for LocalStack development)
- Terraform (for infrastructure management)

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/gabo2212/TheBigVon-second-coming.git
cd TheBigVon-second-coming

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Local Development with AWS Services

```bash
# Start LocalStack (mocked AWS services)
npm run localstack:up

# Initialize Terraform
npm run tf:init

# Validate Terraform configuration
npm run tf:validate

# Plan the infrastructure
npm run tf:plan

# Apply the infrastructure
npm run tf:apply

# Start the dev server
npm run dev
```

### Verification

```bash
# Verify AWS credentials and LocalStack connection
npm run aws:verify
```

## 📁 Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── generate/            # Content generation endpoint
│   │   ├── projects/            # Project CRUD endpoints
│   │   ├── render/              # Rendering endpoint
│   │   └── rewrite/             # Safety rewriting endpoint
│   ├── create/                  # Creation page
│   ├── dashboard/               # Dashboard page
│   ├── editor/                  # Project editor
│   ├── projects/                # Projects library
│   ├── render/                  # Render preview
│   ├── results/                 # Results display
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── app-shell.tsx            # Main app wrapper
│   ├── create-form.tsx          # Creation form
│   ├── scene-editor.tsx         # Scene editing component
│   ├── export-actions.tsx       # Export functionality
│   └── [other components]       # UI components
├── lib/                          # Utility functions
│   ├── generation/              # Content generation logic
│   ├── safety/                  # Content safety & filtering
│   ├── server/                  # Server-side utilities
│   │   ├── aws.ts              # AWS service integration
│   │   ├── project-repository.ts # Project data access
│   │   └── script-format.ts    # Script formatting
│   ├── storage.ts              # Storage utilities
│   ├── types.ts                # TypeScript type definitions
│   └── modes.ts                # Skit mode definitions
├── public/                       # Static assets
│   └── assets/                  # Images, audio
├── terraform/                    # Infrastructure configuration
│   ├── main.tf
│   ├── provider.tf
│   ├── variables.tf
│   └── outputs.tf
├── scripts/                      # Shell scripts
│   ├── stack-up.sh             # Start full stack
│   ├── stack-down.sh           # Stop stack
│   └── aws-verify.sh           # Verify AWS setup
└── docker-compose.yml           # LocalStack configuration
```

## 🎯 Available Skit Modes

### 1. **Hellcat Demon** 😈
A chaotic, unpredictable storytelling mode featuring dramatic plot twists and supernatural elements.

### 2. **Fake Plug** 🎭
Humorous skits about deceptive situations and elaborate schemes gone wrong.

### 3. **Friend Weird** 👥
Relatable friend group dynamics with awkward and entertaining moments.

### 4. **Rental Flex** 🚗
Stories centered around rental car mishaps and overconfident borrowing scenarios.

### 5. **Court Panic** ⚖️
Legal drama-inspired narratives with courtroom chaos and unexpected outcomes.

## 🧠 Ending Styles

- **Humiliating**: Embarrassing conclusions
- **Broke**: Financial ruin outcomes
- **Exposed**: Revelation-based endings
- **Mechanical Failure**: Technical mishaps
- **Legal Panic**: Legal consequences
- **Group Chat Roast**: Social embarrassment
- **Crazy Story Twist**: Unexpected plot turns

## 📤 Export Formats

- **TikTok Skit**: Short-form video script
- **Case File**: Detailed narrative breakdown
- **Caption Pack**: Visual text overlays
- **Narrator Script**: Full narration text
- **Reels Caption**: Instagram Reels format
- **Shorts Script**: YouTube Shorts format

## 🔒 Safety Features

TheBigVon includes built-in content safety mechanisms:

- **Content Filtering**: Automatic detection of inappropriate content
- **Intelligent Rewriting**: Safe alternatives to flagged content
- **Audit Trail**: Tracks all safety actions and rewrites
- **Customizable Rules**: Extensible safety rule system

## 📊 Key Types

### SkitProject
Complete project containing:
- Scenario and generation parameters
- Generated scenes and dialogue
- Safety analysis and rewrites
- Dashboard statistics
- Export-ready content

### ModeDefinition
Configuration for each storytelling mode including:
- Visual accent colors
- Scene structure
- Safety notes
- Sample content

## 📦 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# LocalStack
npm run localstack:up    # Start LocalStack
npm run localstack:down  # Stop LocalStack
npm run localstack:logs  # View LocalStack logs

# Terraform
npm run tf:init      # Initialize Terraform
npm run tf:validate  # Validate configuration
npm run tf:plan      # Preview changes
npm run tf:apply     # Apply infrastructure
npm run tf:destroy   # Destroy infrastructure

# Stack Management
npm run stack:up     # Start full development stack
npm run stack:down   # Stop stack
npm run stack:destroy # Destroy stack and clean up
npm run aws:verify   # Verify AWS connection
```

## 🌐 API Endpoints

### POST `/api/generate`
Generate new skit content based on parameters.

**Request Body:**
```json
{
  "scenario": "User input scenario",
  "mode": "hellcat_demon",
  "chaosLevel": 7,
  "endingStyle": "humiliating",
  "format": "tiktok_skit"
}
```

### GET/POST/DELETE `/api/projects/[projectId]`
Manage individual projects.

### GET `/api/projects`
List all projects.

### POST `/api/render`
Render project content.

### POST `/api/rewrite`
Safety check and rewrite content.

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Cloud Deployment

Using Terraform to deploy to AWS:

```bash
npm run tf:apply
```

This will provision:
- S3 buckets for project storage
- DynamoDB tables for metadata
- API Gateway and Lambda functions (if configured)
- IAM roles and security groups

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# LocalStack (development)
LOCALSTACK_ENDPOINT=http://localhost:4566

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Terraform Variables

Edit `terraform/terraform.tfvars`:

```hcl
aws_region = "us-east-1"
environment = "development"
project_name = "thebigvon"
```

## 📝 Development Guidelines

- Use TypeScript strict mode
- Follow ESLint configuration
- Implement proper error handling
- Add safety checks for user input
- Document API endpoints
- Test with multiple export formats

## 🐛 Troubleshooting

### LocalStack Connection Issues

```bash
# Check if LocalStack is running
docker ps | grep localstack

# View logs
npm run localstack:logs

# Restart LocalStack
npm run localstack:down
npm run localstack:up
```

### AWS Credential Issues

```bash
# Verify AWS configuration
npm run aws:verify

# Check credentials file
cat ~/.aws/credentials
```

### Terraform Issues

```bash
# Reinitialize Terraform
rm -rf terraform/.terraform
npm run tf:init

# Validate configuration
npm run tf:validate
```

## 📄 License

MIT License - Feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For issues, questions, or feature requests, please open an issue on GitHub or check the documentation files:
- `LOCALSTACK.md` - LocalStack setup details
- `LOCALSTACK_TP_SKELETON_PLAN.md` - Infrastructure planning guide

---

**Made with 🎬 by the DemonDash Team**

[View on GitHub](https://github.com/gabo2212/TheBigVon-second-coming)
