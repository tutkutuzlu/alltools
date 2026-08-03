import { discoverProject } from "./lib/project.mjs";
import { validateProject } from "./lib/validate-project.mjs";

const project = await discoverProject();
const errors = await validateProject(project);
if (errors.length) {
  console.error(`Validation failed with ${errors.length} error(s):\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`Validation passed: ${project.tools.length} tool(s), ${project.categories.length} category.`);
}
