#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

function parse_ast_type_name_mapping_key({
  configurations,
  mapping,
  parsed_ast,
  solidity_data,
}: {
  configurations: CLI.parsed;
  mapping: Solidity.AST.nodeType.Mapping;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
}): string {
  if ("Mapping" !== mapping.nodeType) {
    const message = [
      `parse_ast_type_name_mapping_key sent incorect node type -> ${mapping.nodeType}`,
      'Acceptable type is "Mapping"',
      JSON.stringify(mapping, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  const type_name_parts: string[] = [];
  if ("ElementaryTypeName" === mapping.keyType.nodeType) {
    const type_name = mapping.keyType.typeDescriptions.typeString;
    type_name_parts.push(type_name);
    if ("string" === type_name) {
      type_name_parts.push("memory");
    }
  } else if ("UserDefinedTypeName" === mapping.keyType.nodeType) {
    const type_name = parse_ast_type_name_user_defined({
      configurations,
      user_defined_type_name: mapping.keyType,
      parsed_ast,
      solidity_data,
    });
    type_name_parts.push(mapping.keyType.pathNode.name);
    type_name_parts.push("memory");
  }

  if (!type_name_parts.length) {
    const message = [
      "parse_ast_type_name_mapping_key failed to parse type name",
      JSON.stringify(mapping, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  return type_name_parts.join(" ");
}
