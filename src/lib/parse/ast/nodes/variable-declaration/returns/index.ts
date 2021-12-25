#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_variable_declaration_returns({
  configurations,
  node,
  parsed_ast,
  solidity_data,
}: {
  configurations: CLI.parsed;
  node: Solidity.AST.nodeType.VariableDeclaration;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
}): string[] {
  if ("VariableDeclaration" !== node.nodeType) {
    const message = [
      `parse_ast_variable_declaration_returns sent incorect node type -> ${node.nodeType}`,
      'Acceptable type is "VariableDeclaration"',
      JSON.stringify(node, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  const type_name_parts: string[] = [];
  if ("ArrayTypeName" === node.typeName.nodeType) {
    const type_names = parse_ast_variable_declaration_returns_array({
      array_type_name: node.typeName,
      configurations,
      parsed_ast,
      solidity_data,
    });
    type_name_parts.push(...type_names);
  } else if ("ElementaryTypeName" === node.typeName.nodeType) {
    const type_name = parse_ast_variable_declaration_returns_elementary({
      configurations,
      elementary_type_name: node.typeName,
      parsed_ast,
      solidity_data,
    });
    if ("string" === node.typeName.typeDescriptions.typeString) {
      type_name_parts.push(`${type_name} memory`);
    } else {
      type_name_parts.push(type_name);
    }
  } else if ("Mapping" === node.typeName.nodeType) {
    const type_name = parse_ast_variable_declaration_returns_mapping({
      configurations,
      mapping: node.typeName,
      parsed_ast,
      solidity_data,
    });
    type_name_parts.push(`${type_name} memory`);
  } else if ("UserDefinedTypeName" === node.typeName.nodeType) {
    const type_name = parse_ast_variable_declaration_returns_user_defined({
      configurations,
      parsed_ast,
      solidity_data,
      user_defined_type_name: node.typeName,
    });
    type_name_parts.push(`${type_name} memory`);
  }

  return type_name_parts;
}
