#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/***/
function parse_ast_type_name_array({
  array_type_name,
  configurations,
  parsed_ast,
  parsed_variable_declaration,
  solidity_data,
}: {
  array_type_name: Solidity.AST.nodeType.ArrayTypeName;
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
  parsed_variable_declaration?: Parsed.AST.VariableDeclaration;
  solidity_data: Solidity.data;
}): string {
  if ("ArrayTypeName" !== array_type_name.nodeType) {
    const message = [
      `parse_ast_type_name_array sent incorect node type -> ${array_type_name.nodeType}`,
      'Acceptable type is "ArrayTypeName"',
      JSON.stringify(array_type_name, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  let type_name;
  if ("ArrayTypeName" === array_type_name.baseType.nodeType) {
    type_name = parse_ast_type_name_array({
      array_type_name: array_type_name.baseType,
      configurations,
      parsed_ast,
      parsed_variable_declaration,
      solidity_data,
    });
  } else if ("ElementaryTypeName" === array_type_name.baseType.nodeType) {
    type_name = array_type_name.baseType.name;
  } else if ("Mapping" === array_type_name.baseType.nodeType) {
    const key = array_type_name.baseType.keyType.name;
    const value = parse_ast_type_name_mapping_value({
      mapping: array_type_name.baseType,
      configurations,
      parsed_ast,
      parsed_variable_declaration,
      solidity_data,
    });
    if (typeof parsed_variable_declaration === "object") {
      parsed_variable_declaration.emit = false;
    }
    type_name = `mapping(${key} => ${value})`;
  } else if ("UserDefinedTypeName" === array_type_name.baseType.nodeType) {
    type_name = parse_ast_type_name_user_defined({
      configurations,
      parsed_ast,
      solidity_data,
      user_defined_type_name: array_type_name.baseType,
    });
  }

  if (!type_name) {
    const message = [
      "parse_ast_type_name_array failed to parse type name",
      JSON.stringify(array_type_name, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  return `${type_name}[]`;
}
