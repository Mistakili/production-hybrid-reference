#!/usr/bin/env node
/**
 * Cross-platform AppDelegate restore after cap sync.
 * Usage: node scripts/restore-appdelegate.mjs [ios-project-path]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const source = path.join(root, 'recipes', 'appdelegate', 'AppDelegate.swift');

const defaultTarget = path.join(
  root,
  'modules',
  'push-notifications',
  'mobile',
  'ios',
  'App',
  'App',
  'AppDelegate.swift',
);

const target = process.argv[2] ? path.resolve(process.argv[2]) : defaultTarget;

if (!fs.existsSync(source)) {
  console.error(`Canonical AppDelegate not found: ${source}`);
  process.exit(1);
}

if (!fs.existsSync(path.dirname(target))) {
  console.warn(`iOS project not found: ${target}`);
  console.warn('Run: cd modules/push-notifications/mobile && npx cap add ios');
  process.exit(0);
}

fs.copyFileSync(source, target);
console.log(`Restored AppDelegate.swift → ${target}`);