#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_imports({
  configurations,
  imports,
}: {
  configurations: CLI.parsed;
  imports: { [key: string]: Parsed.AST.ImportDirective };
}): string {
  return Object.entries(imports)
    .reduce((accumulate_required, [absolute_path, import_directive]) => {
      const names = Object.values(import_directive.symbolAliases).reduce(
        (accumulate_names, symbol_alias) => {
          if (symbol_alias.required) {
            accumulate_names.push(symbol_alias.name);
          }
          return accumulate_names;
        },
        [] as string[]
      );

      if (!!names.length) {
        const file_path = build_interface_imports_path({
          configurations,
          absolute_path,
        });
        if (names.length > 1) {
          const parts = [
            `import {`,
            names.map((name) => `    ${name}`).join(",\n"),
            `} from "${file_path}";`,
          ];
          accumulate_required.push(parts.join("\n"));
        } else {
          accumulate_required.push(
            `import { ${names.join(", ")} } from "${file_path}";`
          );
        }
      }

      return accumulate_required;
    }, [] as string[])
    .join("\n");
}
