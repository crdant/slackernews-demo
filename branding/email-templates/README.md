# Email Template Builder

A modern email template build system using MJML + PostCSS for SlackerNews email templates.

## Features

- **Single source template** - One MJML template generates all 10 email variants
- **Theme-based customization** - JSON config files define colors, text, and content per template
- **Email client compatibility** - MJML handles cross-client rendering issues
- **Modern CSS processing** - PostCSS with custom properties, nesting, and optimization
- **Build automation** - Generate HTML and JSON outputs for easy integration

## Directory Structure

```
email-template-builder/
├── src/
│   └── base-email.mjml          # Base template with Handlebars variables
├── config/                      # JSON config files for each template variant
│   ├── temporaryLoginLink.json
│   ├── versionUpdateAvailable.json
│   └── ...
├── scripts/
│   └── build.js                 # Build script
├── dist/                        # Generated HTML files
├── templates/                   # Generated JSON files (original format)
└── postcss.config.js           # PostCSS configuration
```

## Usage

### Install Dependencies

```bash
npm install
```

### Build All Templates

```bash
npm run build
```

This generates:
- `dist/*.html` - Clean HTML files for each template
- `templates/*.json` - Individual JSON files in original format
- `dist/email-templates.json` - Combined JSON file matching original structure

### Build Single Template

```bash
npm run build:template templateId
# Example: npm run build:template temporaryLoginLink
```

### Clean Output

```bash
npm run clean
```

## Configuration

Each template is configured via JSON files in the `config/` directory. Example:

```json
{
  "id": "temporaryLoginLink",
  "subject": "Complete your login to {{app_name}}",
  "header_color": "#FF6B35",
  "accent_color": "#38A169", 
  "badge_text": "Account Activated!",
  "main_title": "You're All Set!",
  // ... more config
}
```

### Available Configuration Options

#### Colors
- `header_color` - Header background color
- `accent_color` - Accent elements (borders, icons)
- `button_color` - Action button background
- `highlight_bg_color` - Content highlight box background

#### Content
- `badge_text` - Header badge text
- `header_emoji` - Large emoji in header
- `main_title` - Main title text
- `content_icon` - Icon in content highlight box
- `highlight_title` - Title in highlight box
- `highlight_description` - Description text
- `button_text` - Action button text
- `signature_text` - Footer signature

#### Variables
All Handlebars variables (e.g., `{{app_name}}`, `{{login_url}}`) are preserved and passed through to the final templates.

## Email Client Compatibility

The build system is optimized for email clients:

- **CSS inlining** - Critical styles are inlined
- **Custom properties** - Converted to static values at build time
- **Email-safe CSS** - Only email-compatible properties used
- **Responsive design** - Mobile-optimized with media queries
- **Cross-client testing** - Styles tested across major email clients

## Template Consolidation

This system achieves ~85-90% code consolidation by:

- **Shared base structure** - One MJML template for all variants
- **Theme variables** - Colors and content defined in config files
- **Automated processing** - Build system handles CSS variable replacement
- **Consistent patterns** - All templates follow same design system

## Development

To add a new template:

1. Create a new JSON config file in `config/`
2. Define colors, content, and variables
3. Run `npm run build` to generate the template
4. The new template will appear in `dist/` and `templates/`

## Integration

The generated `dist/email-templates.json` file is a drop-in replacement for the original email templates JSON, with the same structure and Unicode escaping.