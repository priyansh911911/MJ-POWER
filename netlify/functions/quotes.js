exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, key, app, token, token-key, token-path, fields, hidden, filter, nearby, collections, permissions, validation, session',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    const response = await fetch('https://v6.frontql.dev/quotes', {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'app': 's3_mjpower_solar',
        'Authorization': 'Basic YXJvZG9zOkFyMGQwc0AyMDI0'
      },
      body: event.body
    });

    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers,
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request' })
    };
  }
};