/**
 * A utility function to combine class names.
 * This is used by the UI components to handle conditional classes.
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
  }