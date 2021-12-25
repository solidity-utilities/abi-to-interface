/**
 * @file
 * @author S0AndS0
 * @license AGPL-3.0
 */

export {};
declare global {
  namespace CLI {
    interface parsed {
      [key: string]: boolean | number | string | undefined;
      abi?: string;
      clobber?: boolean;
      exclude_enums?: boolean;
      exclude_events?: boolean;
      exclude_functions?: boolean;
      exclude_variables?: boolean;
      exclude_structs?: boolean;
      import_contracts?: boolean;
      import_enums?: boolean;
      import_path?: boolean;
      import_structs?: boolean;
      help?: boolean;
      include_documentation?: boolean;
      out?: string;
      package_json?: string;
      prefix?: string;
      suffix?: string;
      verbose?: boolean;
      version?: boolean;
    }

    interface configurations {
      [key: string]:
        | Configurations.booleanEntry
        | Configurations.numberEntry
        | Configurations.stringEntry;
    }

    namespace Configurations {
      interface base {
        [key: string]: unknown;
        help: string;
        parameters: string[];
        value_default?: boolean | number | string;
        value_type: "boolean" | "number" | "string";
      }

      interface booleanEntry extends base {
        value_default?: boolean;
        value_type: "boolean";
      }

      interface numberEntry extends base {
        value_default?: number;
        value_type: "number";
      }

      interface stringEntry extends base {
        value_default?: string;
        value_type: "string";
      }
    }
  }
}
