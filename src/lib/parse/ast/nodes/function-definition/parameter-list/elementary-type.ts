#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_parameter_list_elementary({
  configurations,
  contract_definition,
  parsed_ast,
  solidity_data,
  elementary_type_name,
}: {
  configurations: CLI.parsed;
  contract_definition: Solidity.AST.nodeType.ContractDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  elementary_type_name: Solidity.AST.nodeType.ElementaryTypeName;
}): string {
  if ("ElementaryTypeName" !== elementary_type_name.nodeType) {
    const message = [
      `parse_ast_parameter_list_elementary sent incorect node type -> ${elementary_type_name.nodeType}`,
      'Acceptable type is "ElementaryTypeName"',
      JSON.stringify(elementary_type_name, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  return elementary_type_name.name;
}
