// 'totken" and "issuer" come from login.js
export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser ($issuer: String!) {
      users(where: {issuer: {_eq: $issuer}}) {
        id
        email
        issuer 
      } 
    }
    `;

  console.log(operationsDoc);
  const response = await queryHesuraGQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );
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
