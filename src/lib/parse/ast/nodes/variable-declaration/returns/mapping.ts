#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_variable_declaration_returns_mapping({
  mapping,
  configurations,
  parsed_ast,
  solidity_data,
}: {
  mapping: Solidity.AST.nodeType.Mapping;
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
}): string {
  if ("Mapping" !== mapping.nodeType) {
    const message = [
      `parse_ast_variable_declaration_returns_mapping sent incorect node type -> ${mapping.nodeType}`,
      'Acceptable type is "Mapping"',
      JSON.stringify(mapping, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  if ("ElementaryTypeName" === mapping.valueType.nodeType) {
    return parse_ast_variable_declaration_returns_elementary({
      configurations,
      elementary_type_name: mapping.valueType,
      parsed_ast,
      solidity_data,
    });
  }

  return parse_ast_type_name_mapping_value({
    configurations,
    mapping,
    parsed_ast,
    solidity_data,
  });
}
