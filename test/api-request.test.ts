import { ApiRequest, axios } from '../src/api/ApiRequest';
import chai from 'chai';
var MockAdapter = require('axios-mock-adapter');
const expect = chai.expect;

describe('Api Request', () => {
  let mock: typeof MockAdapter;

  before(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  after(() => {
    mock.restore();
  });

  it('returns correct response', async () => {
    mock.onGet('/api/users').reply(200, {
      users: [{ id: 1, name: 'John Smith' }]
    });
    const data = await new ApiRequest(
      '/api/users',
      'GET',
      false
    ).performRequest();

    expect(data).to.be.eql({ users: [{ id: 1, name: 'John Smith' }] });
  });

  it('sets query parameters correctly', async () => {
    mock.onGet('/api/users?name=john').reply(200, {
      users: [{ id: 1, name: 'John Smith' }]
    });
    await new ApiRequest('/api/users', 'GET', false, [
      { key: 'name', value: 'john' }
    ]).performRequest();

    expect(mock.history.get[0].url).to.be.eql('/api/users?name=john');
  });
  it('sets url parameters correctly', async () => {
    mock.onGet('/api/users/1').reply(200, { id: 1, name: 'John Smith' });
    await new ApiRequest('/api/users/:id', 'GET', false, undefined, [
      { key: ':id', value: '1' }
    ]).performRequest();
    expect(mock.history.get[0].url).to.be.eq('/api/users/1');
  });
});
