const apiHelper = async (endpoint, { body, ...customConfig } = {}) => {
  let response;

  const headers = {
    "content-type": "application/json",
  };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    response = await window.fetch(`${endpoint}`, config);
  } catch (error) {
    return Promise.reject(new Error("System Error"));
  }

  if (response.ok) {
    try {
      return await response.json();
    } catch (err) {
      Promise.resolve();
    }
  } else {
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage));
  }
};

export default apiHelper;
