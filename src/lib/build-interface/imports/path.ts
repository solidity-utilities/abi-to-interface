#!/usr/bin/env node

/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

("use strict");

function build_interface_imports_path({
  configurations,
  absolute_path,
}: {
  configurations: CLI.parsed;
  absolute_path: string;
}): string {
  if (!configurations.abi) {
    throw new Error("");
  }

  // Allow third-party parsing of import paths via piping
  if (!configurations.out) {
    return absolute_path;
  }

  // Likely a third-party dependency
  if (!absolute_path.startsWith("project:")) {
    return absolute_path;
  }

  // Assume output project uses ABI as external dependency
  if (configurations.out.startsWith("/")) {
    let package_json = configurations.package_json;
    if (!package_json) {
      const abi_path_parts = configurations.abi.split(path.sep);
      for (const index of Object.keys(abi_path_parts).reverse()) {
        const p = abi_path_parts
          .slice(0, Number(index))
          .concat("package.json")
          .join(path.sep);

        if (fs.existsSync(p)) {
          package_json = p;
          break;
        }
      }
    }

    if (!package_json) {
      throw new Error("");
    }

    const package_json_data = require(package_json);
    const package_name = package_json_data["name"];

    if (!package_name) {
      throw new Error("");
    }

    return absolute_path.replace(/project:/, package_name);
  }

  // TODO: refactor this grossness if possible
  const target_parts = absolute_path.replace("project:/", "").split("/");
  const iter_target = function* () {
    for (const value of target_parts) {
      yield value;
    }
  };

  const dependent_parts = configurations.out.split("/");
  const iter_dependent = function* () {
    for (const value of dependent_parts) {
      yield value;
    }
  };

  const zipper = function* (
    ...iters: Array<Iterator<string>>
  ): IterableIterator<[number, string[]]> {
    let index = 0;
    while (true) {
      const results = iters.map((iter) => iter.next());
      if (results.every(({ done }) => done === true)) {
        break;
      }
      yield [index++, results.map(({ value }) => value)];
    }
  };

  let index = -1;
  for (const [i, [target, dependent]] of zipper(
    iter_target(),
    iter_dependent()
  )) {
    if (target !== dependent) {
      index = i;
      break;
    }
  }

  const divergent_target_parts = target_parts.slice(index);
  const divergent_dependent_parts = dependent_parts.slice(index);
  if (divergent_dependent_parts.length > 1) {
    // console.log("must backtrack");
    return divergent_dependent_parts
      .slice(0, divergent_dependent_parts.length - 1)
      .map((part, i) => {
        if (i <= index) {
          return "..";
        } else {
          return part;
        }
      })
      .concat(divergent_target_parts[divergent_target_parts.length - 1])
      .join("/");
  } else {
    // console.log("must go deeper");
    return `./${divergent_target_parts.join("/")}`;
  }
}
