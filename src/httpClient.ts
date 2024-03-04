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
    
    return applyInterceptors(updatedResponse);
  }
  

  const applyInterceptors = async (response) => {
    // for await
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
    for (const handler of interceptors.response.handlers) {
      await handler(response);
    }
    return response;
  }
  

  return {
    interceptors,
    get,
    createInstance() {
      return httpClient()
    }
  }

}


(async () => {
 const HttpClient = httpClient().createInstance();
 
 HttpClient.interceptors.response.use(
    (response) => {
    console.log("Interceptamos o request");
    response.status = 0;
    return response;
  },
);
  
HttpClient.interceptors.response.use(
    (response) => {
    console.log("o status é: ", response.status);
    return response;
  },
);

const response = await HttpClient.get("https://api.github.com/users/virginiarcruz")
// console.log("response", response);
})();
