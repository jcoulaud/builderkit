#!/usr/bin/env node

/**
 * Generates command files from skill files.
 * Single source of truth: SKILL.md -> brainstorm.md
 *
 * Run: node scripts/generate-commands.js
 */

const fs = require('fs');
const path = require('path');

const PLUGIN_DIR = path.join(__dirname, '..');
const SKILL_PATH = path.join(PLUGIN_DIR, 'skills/domain-availability/SKILL.md');
const COMMAND_PATH = path.join(PLUGIN_DIR, 'commands/brainstorm.md');

function generateBrainstormCommand() {
  const skillContent = fs.readFileSync(SKILL_PATH, 'utf8');

  // Extract everything after the skill frontmatter and "When to Activate" section
  const lines = skillContent.split('\n');

  // Find where the actual content starts (after "When to Activate" section)
  let startIndex = 0;
  let foundWhenToActivate = false;
  let foundNextSection = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('## When to Activate')) {
      foundWhenToActivate = true;
    }
    if (foundWhenToActivate && lines[i].startsWith('## ') && !lines[i].includes('When to Activate')) {
      startIndex = i;
      foundNextSection = true;
      break;
    }
  }

  if (!foundNextSection) {
    console.error('Could not find content start in SKILL.md');
    process.exit(1);
  }

  // Remove the "---" separator before the next section if present
  if (startIndex > 0 && lines[startIndex - 1].trim() === '---') {
    startIndex--;
  }

  // Build the command content
  const commandFrontmatter = `---
description: Brainstorm domain name ideas and check availability
---

<!-- AUTO-GENERATED FROM SKILL.md - DO NOT EDIT MANUALLY -->
<!-- Source: skills/domain-availability/SKILL.md -->
<!-- Run: node scripts/generate-commands.js -->

Brainstorm creative domain names for: "$ARGUMENTS"
`;

  const skillBody = lines.slice(startIndex).join('\n');

  const commandContent = commandFrontmatter + '\n' + skillBody;

  // Write the generated command file
  fs.writeFileSync(COMMAND_PATH, commandContent);

  console.log('Generated:', COMMAND_PATH);
  console.log('From:', SKILL_PATH);
}

generateBrainstormCommand();
