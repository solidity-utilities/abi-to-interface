#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_import_directive({
  configurations,
  parsed_ast,
  solidity_data,
  import_directive,
}: {
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  import_directive: Solidity.AST.nodeType.ImportDirective;
}): Parsed.AST.ImportDirective {
  if ("ImportDirective" !== import_directive.nodeType) {
    const message = [
      `parse_ast_import_directive sent incorect node type -> ${import_directive.nodeType}`,
      'Acceptable node type is "ImportDirective"',
      JSON.stringify(import_directive, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  const symbolAliases = import_directive.symbolAliases.reduce((accumulator, alias) => {
    accumulator[alias.foreign.name] = {
      name: alias.foreign.name,
      required: false,
    };
    return accumulator;
  }, {} as Parsed.AST.symbolAliases);

  return {
    absolutePath: import_directive.absolutePath,
    symbolAliases,
  } as Parsed.AST.ImportDirective;
}
