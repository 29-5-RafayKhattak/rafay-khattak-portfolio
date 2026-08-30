import { bucket, defineRailway, github, postgres, preserve, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const Postgres = postgres("Postgres", { region: "ams" });
  const postgresVolume = volume("postgres-volume", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "ams", sizeMB: 50000 });
  const portfolioMediaAms = bucket("portfolio-media-ams", { region: "ams" });
  const rafayKhattakPortfolio = service("rafay-khattak-portfolio", {
    source: github("29-5-RafayKhattak/rafay-khattak-portfolio", { checkSuites: false }),
    start: "npm run start",
    replicas: { "ams": 1 },
    deploy: { preDeployCommand: ["npm run db:migrate && npm run db:seed"] },
    env: { DATABASE_URI: preserve(), PAYLOAD_SECRET: preserve(), S3_ACCESS_KEY_ID: preserve(), S3_BUCKET: preserve(), S3_ENDPOINT: preserve(), S3_REGION: preserve(), S3_SECRET_ACCESS_KEY: preserve() },
  });

  return project("just-nurturing", {
    resources: [Postgres, rafayKhattakPortfolio, postgresVolume, portfolioMediaAms],
  });
});
