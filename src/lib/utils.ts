// filepath: /Users/amyyu/Documents/Projects/gym-planner/web/src/lib/utils.ts
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}