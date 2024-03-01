const HttpClient = {};

HttpClient.interceptors = {
    response: {
      handlers: [],
      use: (handler)  => {
        HttpClient.interceptors.response.handlers.push(handler);
      },
    },
};

HttpClient.get = async function get(url) {
    const response = await fetch(url);      
    const data = await response.json();
    const updatedResponse = {
      data,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    }
    
    return HttpClient.setInterceptors(updatedResponse);
  };
  
HttpClient.setInterceptors = async function setInterceptors(response) {
    for (const handler of HttpClient.interceptors.response.handlers) {
      await handler(response);
    }
    return response;
};

(async () => {
 HttpClient.interceptors.response.use(
    (response) => {
    console.log("Interceptamos o request");
    return response;
  },
);

const response = await HttpClient.get("https://api.github.com/users/omariosouto")
console.log("response", response);
})();