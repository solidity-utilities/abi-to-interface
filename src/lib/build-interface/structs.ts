#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_structs({
  configurations,
  indentation = 0,
  structs,
}: {
  configurations: CLI.parsed;
  indentation: number;
  structs: { [key: string]: Parsed.AST.StructDefinition };
}): string {
  return Object.entries(structs)
    .reduce((accumulator, [key, data]) => {
      if (!data.required) {
        if (configurations.verbose) {
          console.log("build_interface_structs skipping ->", { key });
        }
        return accumulator;
      }
      const indentation_value = "    ";

      const output = [
        `${indentation_value.repeat(indentation)}struct ${data.name} {`,
      ];
      output.push(
        data.members
          .map((member) => {
            return `${indentation_value.repeat(indentation + 1)}${member};`;
          })
          .join("\n")
      );
      output.push("}");
      accumulator.push(output.join("\n"));

      return accumulator;
    }, [] as string[])
    .join("\n\n");
}
