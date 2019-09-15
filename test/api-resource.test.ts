import chai from 'chai';
import { ApiResource } from '../src/api/ApiResource';
const expect = chai.expect;

interface TestModel {
  name: string;
  age: number;
  occupation?: string;
}
const john: TestModel = {
  name: 'John Doe',
  age: 22
};

const johnAndJane: TestModel[] = [
  john,
  {
    name: 'Jane Doe',
    age: 23
  }
];

class TestClass extends ApiResource<TestModel> {}

class TestClassTwo extends ApiResource<TestModel> {
  transformItem(item: TestModel) {
    return {
      name: {
        first: item.name.split(' ')[0],
        last: item.name.split(' ')[1]
      },
      age: item.age
    };
  }
}
class TestClassThree extends ApiResource<TestModel> {
  transformItem(item: TestModel) {
    let data = {
      name: {
        first: item.name.split(' ')[0],
        last: item.name.split(' ')[1]
      },
      age: item.age
    };
    this.mergeWhen(true, { location: 'California, USA' }, data);
    return data;
  }
}

describe('Api Resources (IApiResource)', () => {
  it('should initialize to the correct model', () => {
    expect(new TestClass(john))
      .to.have.property('models')
      .to.be.eql(john);
  });
  it('should return default model if no changes are set', () => {
    expect(new TestClass(john).applyTransformation()).to.be.eql(john);
  });
  it('should apply changes to scheme when defined', () => {
    expect(new TestClassTwo(john).applyTransformation()).to.be.eql({
      name: {
        first: 'John',
        last: 'Doe'
      },
      age: 22
    });
  });
  it('should return the same type as inputted', () => {
    expect(new TestClassTwo(johnAndJane).applyTransformation()).to.be.an(
      'array'
    );
    expect(new TestClassTwo(john).applyTransformation()).to.be.an('object');
  });
  it('should apply changes to scheme when source is array', () => {
    expect(new TestClassTwo(johnAndJane).applyTransformation()).to.be.eql([
      {
        name: {
          first: 'John',
          last: 'Doe'
        },
        age: 22
      },
      {
        name: {
          first: 'Jane',
          last: 'Doe'
        },
        age: 23
      }
    ]);
  });
  it('should merge object when condition is true', () => {
    const a = new TestClassThree(john).applyTransformation();
    expect(a).to.have.property('location');
  });
});
