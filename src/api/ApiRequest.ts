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
export interface ApiRequestConfig {
  endpoint: string;
  method: Method;
  authenticated?: boolean;
  urlParams?: ApiRequestParam[];
  endpointParams?: ApiRequestParam[];
  data?: object;
}

export class ApiRequest {
  private _config: ApiRequestConfig;

  // The public headers that should be passed with every resuest
  private publicHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  constructor(config: ApiRequestConfig) {
    this._config = config;
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
    let endpoint = this._config.endpoint;
    if (!this._config.endpointParams) return this._config.endpoint;
    this._config.endpointParams.forEach((param: ApiRequestParam): void => {
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
    if (!this._config.urlParams || !this._config.urlParams.length)
      return endpoint;
    endpoint = endpoint + '?';
    this._config.urlParams.forEach((urlParam: ApiRequestParam): void => {
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
    if (!this._config.authenticated) return this.publicHeaders;
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
      method: this._config.method,
      headers: headers,
      data: this._config.data
    };
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
