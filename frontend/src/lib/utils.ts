type ClassValue = string | boolean | undefined | null | { [key: string]: boolean | undefined | null };

/**
 * Combines and filters conditional CSS class names into a single string.
 *
 * Replaces external libraries like `clsx` or `classnames` with zero dependencies.
 *
 * Usage examples:
 * - `cn("btn", isActive && "btn-active")` -> `"btn btn-active"` or `"btn"`
 * - `cn("card", isDark ? "bg-black" : "bg-white", undefined, null)` -> `"card bg-black"`
 * - `cn("badge", { "badge-primary": true, "badge-hidden": false })` -> `"badge badge-primary"`
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (Boolean(value)) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
