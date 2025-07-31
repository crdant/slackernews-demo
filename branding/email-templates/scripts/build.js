#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const mjml = require('mjml');
const postcss = require('postcss');
const postcssConfig = require('../postcss.config.js');
const Handlebars = require('handlebars');

// Directories
const CONFIG_DIR = path.join(__dirname, '../config');
const SRC_DIR = path.join(__dirname, '../src');
const DIST_DIR = path.join(__dirname, '../dist');
const TEMPLATES_DIR = path.join(__dirname, '../templates');

// Ensure output directories exist
async function ensureDirectories() {
  await fs.mkdir(DIST_DIR, { recursive: true });
  await fs.mkdir(TEMPLATES_DIR, { recursive: true });
}

// Load template configuration
async function loadTemplateConfig(templateId) {
  const configPath = path.join(CONFIG_DIR, `${templateId}.json`);
  const configContent = await fs.readFile(configPath, 'utf8');
  return JSON.parse(configContent);
}

// Process CSS with PostCSS
async function processCSS(css, variables) {
  // Replace CSS custom properties with actual values
  let processedCSS = css;
  
  // Replace CSS variables with actual values
  for (const [key, value] of Object.entries(variables)) {
    const cssVar = `var(--${key.replace(/_/g, '-')})`;
    processedCSS = processedCSS.replace(new RegExp(cssVar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  
  // Process with PostCSS
  const processor = postcss(postcssConfig.plugins);
  const result = await processor.process(processedCSS, { from: undefined });
  
  return result.css;
}

// Build a single template
async function buildTemplate(templateId) {
  console.log(`Building template: ${templateId}`);
  
  try {
    // Load configuration
    const config = await loadTemplateConfig(templateId);
    
    // Load base MJML template
    const baseTemplatePath = path.join(SRC_DIR, 'base-email.mjml');
    const baseTemplate = await fs.readFile(baseTemplatePath, 'utf8');
    
    // Compile Handlebars template
    const template = Handlebars.compile(baseTemplate);
    
    // Render MJML with config values
    const mjmlContent = template(config);
    
    // Process MJML to HTML
    const mjmlResult = mjml(mjmlContent, {
      validationLevel: 'soft',
      filePath: baseTemplatePath
    });
    
    if (mjmlResult.errors.length > 0) {
      console.warn(`MJML warnings for ${templateId}:`, mjmlResult.errors);
    }
    
    let html = mjmlResult.html;
    
    // Extract and process CSS
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    if (styleMatch) {
      const originalCSS = styleMatch[1];
      const processedCSS = await processCSS(originalCSS, config);
      html = html.replace(styleMatch[0], `<style type="text/css">${processedCSS}</style>`);
    }
    
    // Save processed HTML
    const outputPath = path.join(DIST_DIR, `${templateId}.html`);
    await fs.writeFile(outputPath, html, 'utf8');
    
    // Create JSON template for the original format
    const jsonTemplate = {
      id: config.id,
      name: config.name,
      subject: config.subject,
      body: html,
      fromAddress: config.fromAddress
    };
    
    if (config.updatedAt) {
      jsonTemplate.updatedAt = config.updatedAt;
    }
    
    const jsonOutputPath = path.join(TEMPLATES_DIR, `${templateId}.json`);
    // Custom JSON stringify to ensure Unicode escaping for < and >
    const jsonString = JSON.stringify(jsonTemplate, null, 2)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e');
    await fs.writeFile(jsonOutputPath, jsonString, 'utf8');
    
    console.log(`✅ Built ${templateId}`);
    return jsonTemplate;
    
  } catch (error) {
    console.error(`❌ Error building ${templateId}:`, error.message);
    throw error;
  }
}

// Build all templates
async function buildAllTemplates() {
  console.log('🚀 Building all email templates...\n');
  
  await ensureDirectories();
  
  // Get all config files
  const configFiles = await fs.readdir(CONFIG_DIR);
  const templateIds = configFiles
    .filter(file => file.endsWith('.json'))
    .map(file => path.basename(file, '.json'));
  
  console.log(`Found ${templateIds.length} templates to build:`);
  templateIds.forEach(id => console.log(`  - ${id}`));
  console.log('');
  
  // Build all templates
  const templates = [];
  for (const templateId of templateIds) {
    try {
      const template = await buildTemplate(templateId);
      templates.push(template);
    } catch (error) {
      console.error(`Failed to build ${templateId}:`, error.message);
      process.exit(1);
    }
  }
  
  // Create combined templates.json file
  const combinedOutput = {
    templates: templates.sort((a, b) => a.id.localeCompare(b.id))
  };
  
  const combinedPath = path.join(__dirname, '../../email-templates.json');
  // Custom JSON stringify to ensure Unicode escaping for < and >
  const combinedJsonString = JSON.stringify(combinedOutput, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
  await fs.writeFile(combinedPath, combinedJsonString, 'utf8');
  
  console.log(`\n✅ Successfully built ${templates.length} templates`);
  console.log(`📁 Output directories:`);
  console.log(`   HTML files: ${DIST_DIR}`);
  console.log(`   JSON files: ${TEMPLATES_DIR}`);
  console.log(`   Combined:   ${combinedPath}`);
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Build all templates
    buildAllTemplates().catch(error => {
      console.error('Build failed:', error);
      process.exit(1);
    });
  } else {
    // Build specific template
    const templateId = args[0];
    buildTemplate(templateId).catch(error => {
      console.error(`Failed to build ${templateId}:`, error);
      process.exit(1);
    });
  }
}

module.exports = { buildTemplate, buildAllTemplates };