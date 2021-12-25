#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/***/
function parse_ast_import_node({
  configurations,
  node,
  parsed_ast,
  solidity_data,
}: {
  configurations: CLI.parsed;
  node:
    | Solidity.AST.nodeType.ContractDefinition
    | Solidity.AST.nodeType.EnumDefinition
    | Solidity.AST.nodeType.StructDefinition;
  parsed_ast: Parsed.ast;
  solidity_data: Solidity.data;
}) {
  if (
    !["ContractDefinition", "EnumDefinition", "StructDefinition"].some(
      (kind) => kind === node.nodeType
    )
  ) {
    const message = [
      `parse_ast_import_node sent incorect node type -> ${node.nodeType}`,
      'Acceptable types are; "ContractDefinition", "EnumDefinition", or "StructDefinition"',
      JSON.stringify(node, null, 2),
    ];
    throw new Error(message.join("\n"));
  }

  const absolute_path = solidity_data.ast.absolutePath;
  const import_directive = parsed_ast.imports.hasOwnProperty(absolute_path)
    ? parsed_ast.imports[absolute_path]
    : ({
        absolutePath: absolute_path,
        symbolAliases: {},
      } as Parsed.AST.ImportDirective);

  const symbol_aliase = import_directive.symbolAliases.hasOwnProperty(node.name)
    ? import_directive.symbolAliases[node.name]
    : {
        name: node.name,
        required: false,
      };

  import_directive.symbolAliases[node.name] = symbol_aliase;
  parsed_ast.imports[absolute_path] = import_directive;
}
