#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_parameter_list_array_type({
  configurations,
  contract_definition,
  parsed_ast,
  solidity_data,
  array_type_name,
}: {
  configurations: CLI.parsed;
  contract_definition: Solidity.AST.nodeType.ContractDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
  array_type_name: Solidity.AST.nodeType.ArrayTypeName;
}): string {
  if ("ArrayTypeName" !== array_type_name.nodeType) {
    const message = [
      `parse_ast_parameter_list_array_type sent incorect node type -> ${array_type_name.nodeType}`,
      'Acceptable type is "ArrayTypeName"',
      JSON.stringify(array_type_name, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  let type_name;

  if ("ArrayTypeName" === array_type_name.baseType.nodeType) {
    type_name = parse_ast_parameter_list_array_type({
      configurations,
      contract_definition,
      parsed_ast,
      solidity_data,
      array_type_name: array_type_name.baseType,
    });
  } else if ("ElementaryTypeName" === array_type_name.baseType.nodeType) {
    type_name = array_type_name.baseType.name;
  } else if ("Mapping" === array_type_name.baseType.nodeType) {
    type_name = parse_ast_parameter_list_mapping_type({
      configurations,
      contract_definition,
      parsed_ast,
      solidity_data,
      mapping: array_type_name.baseType,
    });
  } else if ("UserDefinedTypeName" === array_type_name.baseType.nodeType) {
    type_name = parse_ast_parameter_list_user_defined_type({
      configurations,
      contract_definition,
      parsed_ast,
      solidity_data,
      user_defined_type_name: array_type_name.baseType,
    });
  }

  return `${type_name}[]`;
}
