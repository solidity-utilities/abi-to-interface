#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface({
  configurations,
  parsed_ast,
}: {
  configurations: CLI.parsed;
  parsed_ast: Parsed.ast;
}): string {
  const chunks: string[] = [];

  if (!!parsed_ast.license.length) {
    chunks.push(`// SPDX-License-Identifier: ${parsed_ast.license}`);
  }

  if (!!parsed_ast.pragma.length) {
    chunks.push(`${parsed_ast.pragma};`);
  }

  if (!!chunks.length) {
    chunks.push("");
  }

  const imports = build_interface_imports({
    configurations,
    imports: parsed_ast.imports,
  });
  if (!!imports.length) {
    chunks.push(imports);
    chunks.push("");
  }

  const enums = build_interface_enums({
    configurations,
    enums: parsed_ast.enums,
    indentation: 0,
  });
  if (!!enums.length) {
    chunks.push(enums);
  }

  const structs = build_interface_structs({
    configurations,
    structs: parsed_ast.structs,
    indentation: 0,
  });
  if (!!structs.length) {
    if (!!enums.length) {
      chunks.push("");
    }
    chunks.push(structs);
  }

  const contracts = build_interface_contracts({
    configurations,
    contracts: parsed_ast.contracts,
  });
  if (!!contracts.length) {
    if (!!structs.length) {
      chunks.push("");
    }
    chunks.push(contracts);
  }

  return chunks.join("\n");
}
