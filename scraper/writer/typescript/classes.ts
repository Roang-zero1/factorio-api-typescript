import { arguments, factorioClass } from "../../types";
import fs from "fs/promises";
import { configure, renderFile } from "eta";

export async function writeClassesDefinition(
  config: arguments,
  classes: [factorioClass],
) {
  configure({ views: "templates" });
  const output = (await renderFile("./typescript/classes", { classes })) || "";
  await fs.writeFile(`${config.outDir}/classes.d.ts`, output, "utf-8");
}
