// 'totken" and "issuer" come from login.js
export async function isNewUser(token) {
  const operationsDoc = `
  query MyQuery {
    users(where: {issuer: {_eq: "did:ethr:0xB6CDA0eb222240b024858f76356e57F83E0C7a4d"}}) {
      email
      id
      issuer
    }
  }
`;
  const response = await queryHesuraGQL(operationsDoc, "MyQuery", {}, token);

  console.log({ response });

  return response?.data?.users?.length === 0;
}

// if (response.errors) {
//   console.log(response.errors);
// } else {
//   return response?.data?.users?.length === 0;
// }

async function queryHesuraGQL(operationsDoc, operationName, variables, token) {
  console.log({ token });
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const operationsDoc = `
  query MyQuery {
    users(where: {issuer: {_eq: "did:ethr:0xB6CDA0eb222240b024858f76356e57F83E0C7a4d"}}) {
      email
      id
      issuer
    }
  }
`;

function fetchMyQuery() {
  return queryHesuraGQL(
    operationsDoc,
    "MyQuery",
    {},
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJkaWQ6ZXRocjoweEI2Q0RBMGViMjIyMjQwYjAyNDg1OGY3NjM1NmU1N0Y4M0UwQzdhNGQiLCJwdWJsaWNBZGRyZXNzIjoiMHhCNkNEQTBlYjIyMjI0MGIwMjQ4NThmNzYzNTZlNTdGODNFMEM3YTRkIiwiZW1haWwiOiJkcG9wZXNjdUBhZGVsYW50by5mciIsImlhdCI6MTY0Nzk0Mzc2MywiZXhwIjoxNjQ4NTUyMjgzLCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciIsImFkbWluIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiZGlkOmV0aHI6MHhCNkNEQTBlYjIyMjI0MGIwMjQ4NThmNzYzNTZlNTdGODNFMEM3YTRkIn19.F6dzuk8_iydhPgRX6p66rurdlBr42LEEMvScA8-a4Wc"
  );
}

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    console.error(errors);
  }
  console.log(data);
}
