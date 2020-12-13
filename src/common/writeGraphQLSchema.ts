import { printSchema } from "graphql";
import { buildSchema } from "../handlers/graphqlHandler";
const fs = require("fs");

const contractLocation = "src/generated";

(() => {
  fs.writeFileSync(
    `${contractLocation}/schema.graphql`,
    printSchema(buildSchema({ connectionId: "connectionId" }))
  );
})();
