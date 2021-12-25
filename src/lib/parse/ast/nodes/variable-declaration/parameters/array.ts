#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_variable_declaration_parameters_array({
  array_type_name,
  configurations,
  parsed_ast,
  solidity_data,
}: {
  array_type_name: Solidity.AST.nodeType.ArrayTypeName;
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
}): string[] {
  if ("ArrayTypeName" !== array_type_name.nodeType) {
    const message = [
      `parse_ast_variable_declaration_parameters_array sent incorect node type -> ${array_type_name.nodeType}`,
      'Acceptable type is "ArrayTypeName"',
      JSON.stringify(array_type_name, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  const parts: string[] = ["uint256"];
  if ("ArrayTypeName" === array_type_name.baseType.nodeType) {
    const type_name = parse_ast_variable_declaration_parameters_array({
      array_type_name: array_type_name.baseType,
      configurations,
      parsed_ast,
      solidity_data,
    });
    parts.push(...type_name);
  } else if ("Mapping" === array_type_name.baseType.nodeType) {
    const type_name = parse_ast_type_name_mapping_key({
      configurations,
      mapping: array_type_name.baseType,
      parsed_ast,
      solidity_data,
    });
    parts.push(type_name);
  }

  return parts;
}
