#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_contracts_functions({
  configurations,
  functions,
}: {
  configurations: CLI.parsed;
  functions: { [key: string]: Parsed.AST.FunctionDefinition };
}): string[] {
  return Object.entries(functions).map(([key, data]) => {
    const output: string[] = [];

    if (
      configurations.include_documentation &&
      data.documentation !== undefined
    ) {
      const documentation = build_interface_contracts_functions_documentation({
        configurations,
        documentation: data.documentation,
      });
      output.push(...documentation);
    }

    const signature = [`    function ${data.name}`];
    if (data.parameters !== undefined && !!data.parameters.length) {
      signature.push(`(${data.parameters.join(", ")})`);
    } else {
      signature.push("()");
    }

    /**
     * @NOTE: Function visibility for `interface` contracts must be `external`
     */
    signature.push(` external`);
    // signature.push(` ${data.visibility}`);

    if ("nonpayable" !== data.stateMutability) {
      signature.push(` ${data.stateMutability}`);
    }

    if (data.returns !== undefined && !!data.returns.length) {
      signature.push(` returns (${data.returns.join(", ")})`);
    }
    output.push(`${signature.join("")};`);

    return output.join("\n");
  });
}
