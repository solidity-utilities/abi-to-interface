/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  export namespace Solidity {
    interface userdoc {
      [key: string]: unknown;
      methods: User_Doc.methods;
    }

    namespace User_Doc {
      type methods = {
        [key in `${string}(${string})` | string]: method_data;
      };

      interface method_data {
        notice?: string;
      }
    }
  }
}
