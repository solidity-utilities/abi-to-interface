/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  export namespace Solidity {
    namespace Atoms {
      type schemaVersion = `${number}.${number}.${number}`;

      type stateMutability = "view" | "nonpayable" | string;

      type src = `${number}:${number}:${number}`;

      type date_time =
        `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;
    }
  }
}
