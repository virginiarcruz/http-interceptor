function HttpClientFactory() {

const httpClient = () => {
  const interceptors = {
    response: {
      handlers: [],
      use: (handler)  => {
        interceptors.response.handlers.push(handler);
      },
    },
  }


  const sendRequest = async (method, url, data, config) => {
    const response = await fetch(url, {
      method,
      body: data,
      ...config,
    });      
    const responseData = await response.json();
    const updatedResponse = {
      responseData,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries())
    }
    
    return applyInterceptors(updatedResponse);
  }
  

  const applyInterceptors = async (response) => {
    for (const handler of interceptors.response.handlers) {
      await handler(response);
    }
    return response;
  }

  const get = (url, config = {}) => {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };
    
    return sendRequest("GET", url, null, config || { headers: {
      ...defaultHeaders,
      ...config,
    } });
  }

  const post = (url, data, config) => {
    return sendRequest("POST", url, JSON.stringify(data), config);
  }

  const put = (url, data, config) => {
    return sendRequest("PUT", url, JSON.stringify(data), config);
  }

  const patch = (url, data, config) => {
    return sendRequest("PATCH", url, JSON.stringify(data), config);
  }
  

  return {
    interceptors,
    get,
    post,
    put,
    patch,
  }
}

  return httpClient();
}


(async () => {
 const HttpClient = HttpClientFactory();
 
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

// const response = await HttpClient.get("https://api.github.com/users/virginiarcruz"
// );
// console.log("response", response);


const bodyData = {
  title: "httpClient-post-test",
  body: "bar",
  userId: 1
};

const postReq = await HttpClient.post("https://jsonplaceholder.typicode.com/posts", bodyData, {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json, text/plain, */*",
  }
  });
console.log("postReq", postReq.responseData);
})();
