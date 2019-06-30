# devcore

<p align="center">
<a href=""><img src="https://travis-ci.com/joachimdalen/devcore.svg?branch=master"></a>
</p>

A set of utilities I find myself using across projects

### ApiRequest

ApiRequest is a wrapper/helper class for generating axios requests. It supports adding endpoints, replace endpoint keys as well as adding query params.

```ts
new ApiRequest(
  endpoint,
  method,
  applyAuthToken,
  urlParams,
  endpointParams,
  data
);
```

#### Examples

This would perform a `DELETE` request to `http://localhost:8080/api/v1/users/1`

```ts
const req = new ApiRequest(
  'http://localhost:8080/api/v1/users/:id',
  'DELETE',
  true,
  [{ key: ':id', value: 1 }]
);

const res = req.performRequest();
```

---

This would perform a `GET` request to `http://localhost:8080/api/v1/users?name=adam`

```ts
const req = new ApiRequest(
  'http://localhost:8080/api/v1/users',
  'GET',
  true,
  undefined,
  [{ key: 'name', value: 'adam' }]
);

const res = req.performRequest();
```

---

This would perform a `POST` request to `http://localhost:8080/api/v1/users` with the body: `{ username: 'adam', password: 'password' }`

```ts
const req = new ApiRequest(
  'http://localhost:8080/api/v1/users',
  'POST',
  true,
  undefined,
  undefined,
  {
    username: 'adam',
    password: 'password'
  }
);

const res = req.performRequest();
```
