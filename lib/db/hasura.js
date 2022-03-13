async function queryHesuraGQL(operationsDoc, operationName, variables) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
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
    users {
      id
      email
      issuer
      publicAddress
    }
    stats {
      id
      favourited
      userId
      videoId
      watched
    }
  }
  
  mutation MyMutation {
    insert_stats(objects: {favourited: 1, id: 2, userId: "same.dan", videoId: "uYbdx4I7STg", watched: true}) {
      affected_rows
    }
  }
`;

function fetchMyQuery() {
  return queryHesuraGQL(operationsDoc, "MyQuery", {});
}

function executeMyMutation() {
  return queryHesuraGQL(operationsDoc, "MyMutation", {});
}

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

async function startExecuteMyMutation() {
  const { errors, data } = await executeMyMutation();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

startExecuteMyMutation();
