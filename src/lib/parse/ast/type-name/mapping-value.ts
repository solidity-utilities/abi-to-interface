#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/***/
function parse_ast_type_name_mapping_value({
  configurations,
  mapping,
  parsed_ast,
  parsed_variable_declaration,
  solidity_data,
}: {
  configurations: CLI.parsed;
  mapping: Solidity.AST.nodeType.Mapping;
  parsed_ast: Parsed.ast;
  parsed_variable_declaration?: Parsed.AST.VariableDeclaration;
  solidity_data: Solidity.data;
}): string {
  if ("Mapping" !== mapping.nodeType) {
    const message = [
      `parse_ast_type_name_mapping_value sent incorect node type -> ${mapping.nodeType}`,
      'Acceptable type is "Mapping"',
      JSON.stringify(mapping, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  if ("ArrayTypeName" === mapping.valueType.nodeType) {
    return parse_ast_type_name_array({
      array_type_name: mapping.valueType,
      configurations,
      parsed_ast,
      parsed_variable_declaration,
      solidity_data,
    });
  } else if ("ElementaryTypeName" === mapping.valueType.nodeType) {
    return mapping.valueType.typeDescriptions.typeString;
  } else if ("Mapping" === mapping.valueType.nodeType) {
    const key = parse_ast_type_name_mapping_key({
      mapping: mapping.valueType,
      configurations,
      parsed_ast,
      solidity_data,
    });
    const type_name = parse_ast_type_name_mapping_value({
      mapping: mapping.valueType,
      configurations,
      parsed_ast,
      parsed_variable_declaration,
      solidity_data,
    });
    if (typeof parsed_variable_declaration === "object") {
      parsed_variable_declaration.emit = false;
    }
    return `mapping(${key} => ${type_name})`;
  } else if ("UserDefinedTypeName" === mapping.valueType.nodeType) {
    return parse_ast_type_name_user_defined({
      user_defined_type_name: mapping.valueType,
      configurations,
      parsed_ast,
      solidity_data,
    });
  }

  const message = [
    "parse_ast_type_name_mapping_value failed to parse type name",
    JSON.stringify(mapping, null, 2),
  ];
  throw new Error(message.join("\n"));
}
