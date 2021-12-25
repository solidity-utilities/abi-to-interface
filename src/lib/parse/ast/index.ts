#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

"use strict";

/***/
function parse_ast({
  configurations,
  solidity_data,
}: {
  configurations: CLI.parsed;
  solidity_data: Solidity.data;
}): Parsed.ast {
  const { ast, sourcePath } = solidity_data;

  const target_contract = (
    (configurations.abi as string).split(path.sep).at(-1) as string
  ).split(".")[0];

  const parsed_ast: Parsed.ast = {
    contracts: {},
    enums: {},
    imports: {},
    license: solidity_data.ast.license,
    pragma: "",
    relativePath: parse_ast_path({ solidity_data }),
    structs: {},
  };

  return solidity_data.ast.nodes.reduce((accumulator, node) => {
    if ("ContractDefinition" === node.nodeType) {
      if (configurations.import_contracts) {
        parse_ast_import_node({
          configurations,
          node,
          parsed_ast,
          solidity_data,
        });
      }
      if (node.name === target_contract || !configurations.import_contracts) {
        accumulator.contracts[node.name] = parse_ast_contract({
          configurations,
          contract_definition: node,
          parsed_ast,
          solidity_data,
        });
      }
    } else if ("EnumDefinition" === node.nodeType) {
      if (configurations.import_enums) {
        parse_ast_import_node({
          configurations,
          node,
          parsed_ast,
          solidity_data,
        });
      } else if (!accumulator.enums.hasOwnProperty(node.name)) {
        accumulator.enums[node.name] = parse_ast_enum_definition({
          configurations,
          parsed_ast,
          solidity_data,
          enum_definition: node,
        });
      }
    } else if (
      "FunctionDefinition" === node.nodeType &&
      configurations.verbose
    ) {
      console.log("// NOTICE: parse_ast ignoring FunctionDefinition ->", {
        node,
      });
    } else if ("ImportDirective" === node.nodeType) {
      accumulator.imports[node.absolutePath] = parse_ast_import_directive({
        configurations,
        parsed_ast,
        solidity_data,
        import_directive: node,
      });
    } else if ("PragmaDirective" == node.nodeType) {
      const version = node.literals
        .filter((literal) => {
          return literal !== "solidity";
        })
        .join("");
      accumulator.pragma = `pragma solidity ${version}`;
    } else if ("StructDefinition" === node.nodeType) {
      if (configurations.import_structs) {
        parse_ast_import_node({
          configurations,
          node,
          parsed_ast,
          solidity_data,
        });
      } else if (!accumulator.structs.hasOwnProperty(node.name)) {
        accumulator.structs[node.name] = parse_ast_struct_definition({
          configurations,
          parsed_ast,
          solidity_data,
          struct_definition: node,
        });
      }
    }
    return accumulator;
  }, parsed_ast);
}
