#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_parameter_list_mapping_type({
  configurations,
  contract_definition,
  parsed_ast,
  solidity_data,
  mapping,
}: {
  configurations: CLI.parsed;
  contract_definition: Solidity.AST.nodeType.ContractDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  mapping: Solidity.AST.nodeType.Mapping;
}): string {
  if ("Mapping" !== mapping.nodeType) {
    const message = [
      `parse_ast_parameter_list_mapping_type sent incorect node type -> ${mapping.nodeType}`,
      'Acceptable type is "Mapping"',
      JSON.stringify(mapping, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  const type_key = parse_ast_type_name_mapping_key({
    configurations,
    mapping,
    parsed_ast,
    solidity_data,
  });

  const type_value = parse_ast_type_name_mapping_value({
    configurations,
    mapping,
    parsed_ast,
    solidity_data,
  });

  return `mapping(${type_key} => ${type_value})`;
}
