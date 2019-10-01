import { ApiError } from '../src/api/ApiError';
import chai from 'chai';
const expect = chai.expect;

describe('ApiError', () => {
  let regularError: ApiError;
  let axiosError: ApiError;

  before(() => {
    let error: Error = new Error('this is the error message');
    regularError = new ApiError(error);

    let ror = {
      response: {
        status: 500,
        statusText: 'Internal server error',
        data: {
          message: 'Error',
          errors: {
            test: ['This is an error']
          }
        },
        config: undefined,
        headers: undefined
      }
    };

    axiosError = new ApiError(ror as any, true);
  });

  it('is not axios error when passed a generic error', async () => {
    expect(regularError.isAxiosError).to.be.false;
  });

  it('sets correct message for generic error', async () => {
    const msg = 'this is the error message';
    expect(regularError.message).to.be.equal(msg);
  });

  it('sets correct values for generic error', async () => {
    const msg = 'this is the error message';
    expect(regularError.message).to.be.equal(msg);
    expect(regularError.statusText).to.be.equal('An error occurred.');
    expect(regularError.errorType).to.be.equal('error');
    expect(regularError.errors).to.be.empty;
    expect(regularError.statusCode).to.be.equal(500);
  });

  it('is axios error when passed axios error', async () => {
    expect(axiosError.message).to.be.equal('Error');
    expect(axiosError.statusText).to.be.equal('Internal server error');
    expect(axiosError.errorType).to.be.equal('validation');
    expect(axiosError.errors).to.not.be.empty;
    expect(axiosError.statusCode).to.be.equal(500);
  });

  it('should be validation error', () => {
    expect(axiosError.isValidationError()).to.be.true;
  });

  it('should return correct error', () => {
    expect(axiosError.getError('test')).to.be.eql(['This is an error']);
  });
});
