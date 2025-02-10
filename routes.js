import { Router } from "express";
import { readdirSync } from "fs";
import { resolve } from "path";

const router = Router();
const routesPath = resolve("routes");

readdirSync(routesPath).forEach((file) => {
  if (file.endsWith(".routes.js")) {
    import(`./routes/${file}`).then((module) => {
      const routeName = `/${file.replace(".routes.js", "")}`;
      router.use(routeName === "/index" ? "/" : routeName, module.default);
    });
  }
});

export default router;
