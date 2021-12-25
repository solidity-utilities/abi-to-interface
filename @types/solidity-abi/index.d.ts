/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  export namespace Solidity {
    // interface contract_data {
    interface data {
      [key: string]: unknown;
      contractName: string;
      abi: Solidity.abi;
      metadata: JSON;
      bytecode: string;
      deployedBytecode: string;
      immutableReferences: { [key: string]: unknown };
      generatedSources: unknown[];
      deployedGeneratedSources: Solidity.deployedGeneratedSources;
      sourceMap: string;
      deployedSourceMap: string;
      source: string;
      sourcePath: string;
      ast: Solidity.ast;
      legacyAST: Solidity.ast;
      compiler: {
        [key: string]: unknown;
        name: "solc" | string;
        version: string;
      };
      networks: { [key: string]: unknown };
      schemaVersion: Solidity.Atoms.schemaVersion;
      devdoc: Solidity.devdoc;
      userdoc: Solidity.userdoc;
    }
  }
}
