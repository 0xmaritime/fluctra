import fs from 'fs';
import path from 'path';

// Read the existing IDL file
const idlPath = path.join('target', 'idl', 'fluctra_launch.json');
console.log(`Reading IDL from ${idlPath}...`);

if (!fs.existsSync(idlPath)) {
  console.error(`IDL file not found at ${idlPath}`);
  process.exit(1);
}

const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

// Generate TypeScript types
const typesDir = path.join('src', 'lib', 'solana', 'types');
const typesPath = path.join(typesDir, 'fluctra_launch.ts');

const typeContent = `// Auto-generated from IDL
import { Idl, Program } from '@coral-xyz/anchor';

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
