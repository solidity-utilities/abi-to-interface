#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_enums({
  configurations,
  enums,
  indentation = 0,
}: {
  configurations: CLI.parsed;
  enums: { [key: string]: Parsed.AST.EnumDefinition };
  indentation: number;
}): string {
  return Object.entries(enums)
    .reduce((accumulator, [key, data]) => {
      if (!data.required) {
        if (configurations.verbose) {
          console.log("build_interface_enums skipping ->", { key });
        }
        return accumulator;
      }
      const indentation_value = "    ";

      const output = [
        `${indentation_value.repeat(indentation)}enum ${data.name} {`,
      ];
      output.push(
        data.members
          .map((member) => {
            return `${indentation_value.repeat(indentation + 1)}${member}`;
          })
          .join(",\n")
      );
      output.push("}");
      accumulator.push(output.join("\n"));

      return accumulator;
    }, [] as string[])
    .join("\n\n");
}
