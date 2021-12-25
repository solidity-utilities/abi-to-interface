#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_contracts_functions_documentation({
  configurations,
  documentation,
}: {
  configurations: CLI.parsed;
  documentation: Parsed.AST.Documentation;
}): string[] {
  const output: string[] = [];

  if (documentation.notice !== undefined && !!documentation.notice.length) {
    output.push(`    /// @notice ${documentation.notice}`);
  }

  if (
    documentation.params !== undefined &&
    !!Object.keys(documentation.params).length
  ) {
    Object.entries(documentation.params).forEach(([key, value]) => {
      output.push(`    /// @param ${key} ${value}`);
    });
  }

  if (
    documentation.returns !== undefined &&
    !!Object.keys(documentation.returns).length
  ) {
    Object.entries(documentation.returns).forEach(([_key, value]) => {
      output.push(`    /// @return ${value}`);
    });
  }

  if (documentation.details !== undefined && !!documentation.details.length) {
    output.push(`    /// @dev ${documentation.details}`);
  }

  if (
    documentation.customs !== undefined &&
    !!Object.keys(documentation.customs).length
  ) {
    Object.entries(documentation.customs).forEach(([key, value]) => {
      output.push(`    /// @${key} ${value}`);
    });
  }

  return output;
}
