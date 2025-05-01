import { Idl, Program } from '@coral-xyz/anchor';

export interface FluctraLaunch extends Idl {
  version: string;
  name: string;
  instructions: any[];
  accounts: any[];
  types: any[];
  errors: any[];
  metadata: any;
}

export type FluctraLaunchProgram = Program<FluctraLaunch>;
