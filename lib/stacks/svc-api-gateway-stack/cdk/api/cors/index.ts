export const buildCorsConfigurations = () => {
  const allowHeaders = [
    "Content-Type",
    "X-Amz-Date",
    "Authorization",
    "X-Api-Key",
  ];

  const allowMethods = ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"];

  const allowCredentials = true;

  const allowOrigins = ["http://localhost:3000"];

  return {
    allowHeaders,
    allowMethods,
    allowCredentials,
    allowOrigins,
  };
};
