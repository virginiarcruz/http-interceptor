const httpClient = () => {
  const interceptors = {
    response: {
      handlers: [],
      use: (handler)  => {
        interceptors.response.handlers.push(handler);
      },
    },
  }

  const get = async (url) => {
    const response = await fetch(url);      
    const data = await response.json();
    const updatedResponse = {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    }
    
    return setInterceptors(updatedResponse);
  }

  const setInterceptors = async (response) => {
    for (const handler of interceptors.response.handlers) {
      await handler(response);
    }
    return response;
  }

  return {
    interceptors,
    get,
  }

}

const HttpClient = httpClient();

(async () => {
 HttpClient.interceptors.response.use(
    (response) => {
    console.log("Interceptamos o request");
    return response;
  },
);

const response = await HttpClient.get("https://api.github.com/users/virginiarcruz")
console.log("response", response);
})();
