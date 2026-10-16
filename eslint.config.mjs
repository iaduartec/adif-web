import nextVitals from "eslint-config-next/core-web-vitals";

// Gitignored worktree snapshots contain generated `.next` chunks that are not
// part of the linted source; ignore them instead of pruning the worktrees.
const eslintConfig = [
  { ignores: [".worktrees/**", "worktrees/**"] },
  ...nextVitals,
];

export default eslintConfig;
