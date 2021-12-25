#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/***/
function parse_ast_variable_declaration({
  configurations,
  node,
  parsed_ast,
  solidity_data,
}: {
  configurations: CLI.parsed;
  node: Solidity.AST.nodeType.VariableDeclaration;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
}): Parsed.AST.VariableDeclaration {
  if ("VariableDeclaration" !== node.nodeType) {
    const message = [
      `parse_ast_variable_declaration sent incorect node type -> ${node.nodeType}`,
      'Acceptable type is "VariableDeclaration"',
      JSON.stringify(node, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  const parsed_variable_declaration = {
    name: node.name,
    stateMutability: node.stateMutability,
    visibility: node.visibility,
  } as Parsed.AST.VariableDeclaration;

  parsed_variable_declaration.parameters =
    parse_ast_variable_declaration_parameters({
      configurations,
      node,
      parsed_ast,
      solidity_data,
    });

  parsed_variable_declaration.returns = parse_ast_variable_declaration_returns({
    configurations,
    node,
    parsed_ast,
    solidity_data,
  });

  return parsed_variable_declaration;
}
