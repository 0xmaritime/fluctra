import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 1. Run anchor build to generate the IDL
console.log('Building Anchor program to generate IDL...');
execSync('anchor build', { stdio: 'inherit' });

// 2. Read the generated IDL
const idlPath = path.join('target', 'idl', 'fluctra_launch.json');
console.log(`Reading IDL from ${idlPath}...`);
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

// 3. Generate TypeScript types
const typesDir = path.join('src', 'lib', 'solana', 'types');
const typesPath = path.join(typesDir, 'fluctra_launch.ts');

const typeContent = `// Auto-generated from IDL
import { Idl } from '@coral-xyz/anchor';

export interface FluctraLaunch extends Idl {
  version: '${idl.version}';
  name: '${idl.name}';
  instructions: ${JSON.stringify(idl.instructions, null, 2)};
  accounts: ${JSON.stringify(idl.accounts, null, 2)};
  types: ${JSON.stringify(idl.types, null, 2)};
  errors: ${JSON.stringify(idl.errors, null, 2)};
  metadata: ${JSON.stringify(idl.metadata, null, 2)};
}

export type FluctraLaunchProgram = Program<FluctraLaunch>;
`;

console.log(`Writing types to ${typesPath}...`);
fs.mkdirSync(typesDir, { recursive: true });
fs.writeFileSync(typesPath, typeContent);

console.log('IDL types generated successfully!');
