#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_contracts({
  configurations,
  contracts,
}: {
  configurations: CLI.parsed;
  contracts: { [key: string]: Parsed.AST.Contract };
}): string {
  return Object.entries(contracts)
    .reduce((accumulator, [key, contract]) => {
      const prefix =
        configurations.prefix !== undefined && !!configurations.prefix.length
          ? configurations.prefix
          : "";

      const suffix =
        configurations.suffix !== undefined && !!configurations.suffix.length
          ? configurations.suffix
          : "";

      const output = [
        "/// @title Automatically generated by `@solidity-utilities/abi-to-interface`",
        `interface ${prefix}${key}${suffix} {`,
      ];

      //
      const enums = build_interface_enums({
        configurations,
        enums: contract.enums,
        indentation: 1,
      });
      if (!!enums.length) {
        output.push("    /* Enum definitions */");
        output.push("");
        output.push(enums);
      }

      //
      const structs = build_interface_structs({
        configurations,
        structs: contract.structs,
        indentation: 1,
      });
      if (!!structs.length) {
        if (!!enums.length) {
          output.push("");
        }
        output.push("    /* Struct definitions */");
        output.push("");
        output.push(structs);
      }

      //
      const events = build_interface_contracts_events({
        configurations,
        events: contract.events,
      });
      if (!!events.length) {
        if (!!structs.length || !!enums.length) {
          output.push("");
        }
        output.push("    /* Event definitions */");
        output.push("");
        output.push(events.join("\n\n"));
      }

      //
      const variables = build_interface_contracts_variables({
        configurations,
        variables: contract.variables,
      });

      if (!!variables.length) {
        if (!!events.length || !!structs.length || !!enums.length) {
          output.push("");
        }
        output.push("    /* Variable getters */");
        output.push("");
        output.push(variables.join("\n\n"));
      }

      //
      const functions = build_interface_contracts_functions({
        configurations,
        functions: contract.functions,
      });

      if (!!functions.length) {
        if (
          !!variables.length ||
          !!events.length ||
          !!structs.length ||
          !!enums.length
        ) {
          output.push("");
        }
        output.push("    /* Function definitions */");
        output.push("");
        output.push(functions.join("\n\n"));
      }

      output.push("}");
      accumulator.push(output.join("\n"));
      return accumulator;
    }, [] as string[])
    .join("\n\n");
}