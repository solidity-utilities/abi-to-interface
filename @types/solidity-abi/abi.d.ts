/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  export namespace Solidity {
    type abi = [ABI.type_constructor?, ABI.type_function?];

    namespace ABI {
      interface type_constructor {
        [key: string]: unknown;
        inputs: Solidity.ABI.Function.input[];
        stateMutability: Solidity.Atoms.stateMutability;
        type: "constructor" | string;
      }

      interface type_function {
        [key: string]: unknown;
        inputs: Solidity.ABI.Function.input[];
        name: string;
        outputs: Solidity.ABI.Function.output[];
        stateMutability: Solidity.Atoms.stateMutability;
        type: "function" | string;
      }

      namespace Function {
        interface input {
          [key: string]: unknown;
          internalType: string;
          name: string;
          type: string;
        }

        interface output extends input {}
      }
    }
  }
}
