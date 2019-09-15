import axios, {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  Method,
  AxiosResponse
} from 'axios';

export interface ApiRequestParam {
  key: string;
  value: string | number;
}

export class ApiRequest {
  // The endpoint to call
  private endpoint: string;
  // Request method
  private method: Method;
  // Endpoint parameters
  private endpointParams?: ApiRequestParam[];
  // Url parameters
  private urlParams?: ApiRequestParam[];
  // If the request should apply auth tokens
  private authenticated: boolean;
  // Additional data to pass to the request
  private requestData?: object;
  // The public headers that should be passed with every resuest
  private publicHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  constructor(
    endpoint: string,
    method: Method,
    applyAuthToken: boolean,
    urlParams?: ApiRequestParam[],
    endpointParams?: ApiRequestParam[],
    data?: object
  ) {
    this.authenticated = applyAuthToken;
    this.endpoint = endpoint;
    this.method = method;
    if (endpointParams) this.endpointParams = endpointParams;
    if (urlParams) this.urlParams = urlParams;
    this.requestData = data;
  }

  /**
   *  Replace endpoint keys.
   *
   * Take the example endpoint: "/admin/users/:id".
   * When passed in the following ApiRequestParam:
   * {key: 'id', value: 1} it will convert the
   * following endpoint url to "/admin/users/1"
   */
  _replaceEndpointKeys(): string {
    let endpoint = this.endpoint;
    if (!this.endpointParams) return this.endpoint;
    this.endpointParams.forEach((param: ApiRequestParam): void => {
      endpoint = endpoint.replace(param.key, param.value.toString());
    });
    return endpoint;
  }

  /**
   * Apply url query string parameters. This should be called
   * after endpoint keys have been inserted.
   *
   * @param endpoint Modified or original endpoint.
   */
  _applyUrlParams(endpoint: string): string {
    if (!this.urlParams || !this.urlParams.length) return endpoint;
    endpoint = endpoint + '?';
    this.urlParams.forEach((urlParam: ApiRequestParam): void => {
      if (urlParam.value === (undefined || null || '')) return;
      endpoint = endpoint + `${urlParam.key}=${urlParam.value}&`;
    });
    return endpoint.substr(0, endpoint.length - 1);
  }

  /**
   * Apply authentication headers if the request requires
   * authentication.
   */
  _applyAuthHeaders(): {} {
    if (!this.authenticated) return this.publicHeaders;
    /* 
    Uncomment the lines below and add your code for 
    fetching the authentication tokens.
    
    const token = getToken();
    return Object.assign({}, this.publicHeaders, {
      Authorization: "Bearer " + token
    });
    */
    return {}; // Delete this when replacing the commented code above.
  }

  /**
   * Do the request and return the result of the request.
   */
  public performRequest(): AxiosPromise {
    let endpoint = this._replaceEndpointKeys();
    endpoint = this._applyUrlParams(endpoint);
    const headers = this._applyAuthHeaders();
    const axiosConfig: AxiosRequestConfig = {
      method: this.method,
      headers: headers,
      data: JSON.stringify(this.requestData)
    };
    console.log(endpoint);
    return axios(endpoint, axiosConfig)
      .then((response: AxiosResponse) => {
        return response.data;
      })
      .catch((error: AxiosError) => {
        throw error;
      });
  }
}
export { axios }; // Exported for testing, remove in production
