export function getGraphqlAPIs() {
  const envGraphqlAPIs = process.env.GRAPHQL_APIS ?? '';
  const list = envGraphqlAPIs
    .split(',')
    .map((item) => item.trim())
    .filter((item) => !!item);

  return list;
}

export function getAPIs() {
  const envAPIs = process.env.APIS ?? '';
  const list = envAPIs
    .split(',')
    .map((item) => item.trim())
    .filter((item) => !!item);

  return list;
}

export function getInitialUsers() {
  const envInitialUsers = process.env.INITIAL_USERS ?? '';
  const list = envInitialUsers
    .split(',')
    .map((item) => item.trim())
    .filter((item) => !!item)
    .map((item) => parseInt(item, 10));

  return list;
}
