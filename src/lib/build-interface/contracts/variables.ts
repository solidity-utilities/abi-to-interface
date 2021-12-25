#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_contracts_variables({
  configurations,
  variables,
}: {
  configurations: CLI.parsed;
  variables: { [key: string]: Parsed.AST.VariableDeclaration };
}): string[] {
  return Object.entries(variables).map(([key, data]) => {
    const output = [];

    const signature = [`    function ${data.name}`];
    if (data.parameters !== undefined && !!data.parameters.length) {
      signature.push(`(${data.parameters.join(", ")})`);
    } else {
      signature.push("()");
    }
    signature.push(` external`);
    // signature.push(` ${data.visibility}`);
    signature.push(` returns (${data.returns.join(", ")})`);

    output.push(`${signature.join("")};`);
    return output.join("\n");
  });
}
