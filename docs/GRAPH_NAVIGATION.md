# Graph Navigation

The repository may contain a generated knowledge graph under `graphify-out/`.
Use graphify only when `graphify-out/graph.json` exists or the user explicitly
requests graph generation.

When the user types `/graphify`, use the installed graphify skill or
instructions before doing anything else.

Rules:

- For codebase questions, first run `graphify query "<question>"` when
  `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for
  relationships and `graphify explain "<concept>"` for focused concepts.
- Dirty `graphify-out/` files are expected after hooks or incremental updates;
  dirty graph files are not a reason to skip graphify.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead
  of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or
  when query, path, or explain does not surface enough context.
- After modifying code, run `graphify update .` only when an existing graph is
  present or the user requested graph generation.
