import { buildSchema } from "../handlers/graphqlHandler";
import { printSchema } from "graphql";
const fs = require("fs");

const contractLocation = "src/generated";

(() => {
  fs.writeFileSync(
    `${contractLocation}/schema.graphql`,
    printSchema(buildSchema(null))
  );
})();
