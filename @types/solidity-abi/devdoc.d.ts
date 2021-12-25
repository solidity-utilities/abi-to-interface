/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  export namespace Solidity {
    interface devdoc {
      [key: string]: unknown;
      author?: string;
      details?: string;
      kind: "dev" | string;
      methods: Dev_Doc.methods;
      title?: string;
      version: number;
    }

    namespace Dev_Doc {
      type methods = {
        [key in `${string}(${string})` | string]: method_data;
      };

      type method_data = {
        [key in `custom:${string}` | string]: unknown;
      } & {
        details?: string;
        params?: {
          [key: string]: string;
        };
        returns?: {
          [key in `_${number}` | string]: string;
        };
      };
    }
  }
}
