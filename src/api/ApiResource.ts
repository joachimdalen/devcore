import { isArray } from 'util';

// Type to define single and array of T as a single type.
export type SingleOrArray<T> = T | T[];

export abstract class ApiResource<T> {
  /**
   * Internal model storage.
   */
  models: SingleOrArray<T>;

  constructor(model: SingleOrArray<T>) {
    this.models = model;
  }

  /**
   * Transform a item to its new structure.
   *
   * @param item item to transform
   */
  transformItem(item: T): {} {
    return item;
  }

  /**
   * Apply the transformation to the items.
   */
  applyTransformation() {
    if (isArray(this.models)) {
      const items = this.models.map(a => this.transformItem(a));
      return this.transformStructure(items as T[]);
    }
    const item = this.transformItem(this.models);
    return this.transformStructure(item as T);
  }

  /**
   * Apply the transformation to the items.
   */
  async applyTransformationAsync() {
    if (isArray(this.models)) {
      const itemsProm = this.models.map(
        async (a: T) => await this.transformItem(a)
      );
      const items = Promise.all(itemsProm).then((r: any) => {
        return r;
      }) as any;
      return this.transformStructure(items as T[]);
    }
    const item = (await this.transformItem(this.models as T)) as T;
    return this.transformStructure(item);
  }

  /**
   * Allows for transforming the structure of which resource items
   * are returned.
   *
   * @param items items blonging to the resource
   */
  transformStructure(items: SingleOrArray<T>) {
    return items;
  }

  /**
   * Only include the item in the object when the condition is true.
   *
   * @param condition Condition to check for
   * @param key The object key to keep or discard
   * @param item The current item
   */
  includeWhen(condition: boolean, key: string, item: any) {
    if (condition === false) {
      delete item[key];
      return item;
    }
  }

  mergeWhen(condition: boolean, data: object, source: object) {
    if (condition) {
      return Object.assign(source, data);
    }
  }
}
