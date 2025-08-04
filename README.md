# SlackerNews CI/CD & Branding Configuration 🚀

This repository contains GitHub Actions workflows and branding configuration
for the SlackerNews application on Replicated. It provides automation for
building, signing, releasing, and customizing your SlackerNews instance.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Repository Structure](#repository-structure)
- [Usage Guide](#usage-guide)
- [Workflows](#workflows)
  - [Release Workflow](#release-workflow)
  - [Branding Workflow](#branding-workflow)
  - [Cluster Workflow](#cluster-workflow)
- [Branding Customization](#branding-customization)
  - [Enterprise Portal](#enterprise-portal)
  - [Email Templates](#email-templates)
- [Deployment](#deployment)

## Overview

This repository provides CI/CD automation to prepare for demonstrating
SlackerNews with Replicated. It helps you:

- 🚀 Build and release new versions of SlackerNews
- 🎨 Customize the enterprise portal appearance
- 📧 Configure branded email templates

## Prerequisites

Before using this repository, you'll need:

- A [Replicated](https://replicated.com) vendor account
- A GitHub account with access to this repository
- The SlackerNews app created in your Replicated vendor portal
- GitHub secrets configured with your Replicated API token

## Repository Structure

```
.
├── .github/workflows/         # GitHub Actions workflow definitions
│   ├── branding.yaml          # Customizes portal and email templates
│   ├── cluster.yaml           # Creates test Kubernetes clusters
│   └── release.yaml           # Builds and releases new versions
├── branding/                  # Branding assets
│   ├── enterprise-portal/     # Enterprise portal branding
│   │   └── branding.yaml      # Portal branding configuration
│   ├── email-templates/       # Email template source files
│   └── enterprise-portal.json # Legacy portal config (deprecated)
└── Makefile                   # Helper commands for running workflows
```

## Usage Guide

### Running a Release

Create a release in GitHub's UI:

1. Navigate to the Actions tab
2. Select the "release" workflow
3. Click "Run workflow"
4. Fill in the required parameters
5. Click "Run workflow"

### Updating Branding

1. Navigate to the Actions tab
2. Select the "branding" workflow
3. Click "Run workflow"
4. Fill in the required parameters
5. Click "Run workflow"

## Deployment

Once a release is created through the workflow, it will be available in your
Replicated vendor portal. The release is initially promoted to the "Unstable"
channel.

To promote to other channels:
1. Log in to your Replicated vendor portal
2. Navigate to Channels
3. Find your release in the Unstable channel
4. Click "Promote" and select the target channel
## Workflows

### Release Workflow

The release workflow builds SlackerNews from source, signs the container
images, generates SBOMs, creates a Helm chart, and releases to Replicated.

**Parameters:**
- `branch`: The source branch to build from (default: `main`)
- `namespace`: Registry namespace for container images
- `slug`: Your Replicated app slug
- `version`: Release version number
- `proxy`: Proxy registry (default: `proxy.replicated.com`)
- `api-endpoint`: Optional custom Replicated API endpoint
- `api-token`: Optional Replicated API token (uses repo secret by default)

### Branding Workflow

The branding workflow updates your Enterprise Portal appearance and email
templates in the Replicated platform.

**Parameters:**
- `slug`: Your Replicated app slug
- `api-token`: Optional Replicated API token (uses repo secret by default)
- `api-origin`: Optional custom Replicated API endpoint

### Cluster Workflow

The cluster workflow provisions test Kubernetes clusters for QA and testing
purposes.

**Parameters:**
- Various parameters for cluster creation including distribution type, version, and TTL

## Branding Customization

### Enterprise Portal

The portal branding is configured in `branding/enterprise-portal/branding.yaml` using a human-readable YAML format. The configuration includes:

- **Basic Information**: App name, description, and URL
- **Visual Branding**: Logo and favicon (supports multiple formats)
- **Color Scheme**: Primary/secondary colors and custom color palette
- **Background**: Custom background settings
- **Contact Details**: Support links and contact information
- **Authentication**: Auth type configuration

#### Logo and Favicon Support

The branding system supports multiple formats for logo and favicon:

- **HTTP/HTTPS URLs**: `https://example.com/logo.png` - Downloaded and converted automatically
- **Local files**: `logo.png` or `assets/favicon.ico` - Read from repository and converted
- **Data URLs**: `data:image/png;base64,iVBORw0K...` - Used directly (already embedded)

The workflow automatically converts URLs and local files to base64 data URLs for optimal performance.

#### Example Configuration

```yaml
branding:
  # Basic portal information
  url: "https://enterprise.replicated.com/your-app"
  title: "Your App Name"
  overview: "Your app description"
  
  # Visual branding (flexible format support)
  logo: "https://example.com/logo.png"  # or logo.png or data:image/...
  favicon: "favicon.ico"                # or https://... or data:image/...
  
  # Color customization
  primaryColor: "#F98228"
  secondaryColor: "#000000"
  customColor1: "#F98228"
  customColor2: "#fcdd4d"
  
  # Contact information
  supportPortalLink: "https://github.com/your-org/your-app/issues"
  contact: "support@example.com"
  
  # Authentication
  authType: "magic"
```

### Email Templates

Email templates are defined in MJML format and compiled to HTML. The system
supports customizing:

- 📧 Temporary login links
- 🎉 New instance notifications
- ⚠️ License expiration warnings
- 🔧 Instance downtime alerts
- 🚀 Version update notifications
- 👤 User invitations and account notifications

To modify email templates, you can fork this repository and edit the template
files.

1. Edit the JSON configuration files in `branding/email-templates/config/`
2. Update the MJML template in `branding/email-templates/src/` if needed
3. Run the branding workflow to apply changes

