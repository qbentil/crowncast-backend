import { Category } from "../models";
import { ICategory, ICreateCategoryParam, IFindCategoryParam } from "../types";
import { ApiErrors, InternalServerError, NotFound } from "../util/error";

export interface ICategoryService<T> {
  findCategoryByTitleAndEvent(query: IFindCategoryParam): Promise<T | ApiErrors>;
  createCategory(param: ICreateCategoryParam): Promise<T | ApiErrors>;
  fetchCategories(): Promise<T[] | ApiErrors>;
}

export class CategoryService implements ICategoryService<ICategory> {
  async findCategoryByTitleAndEvent(query: IFindCategoryParam): Promise<ICategory | ApiErrors> {
    const { title, event } = query;
    let category;
    try {
      category = await Category.findOne({ title, event });
      if (!category) throw new NotFound("404", "category not found");
      return category;
    } catch (e) {
      // TODO: call exception handler, send error to sentry
      return this._serviceExceptionHandler(e);
    }
  }
  async createCategory(param: ICreateCategoryParam): Promise<ICategory | ApiErrors> {
    const { title, event, description } = param;
    try {
      if (await this.findCategoryByTitleAndEvent({ title, event }))
        throw new NotFound("404", "category already exists");
      const category = await Category.create({ title, description, event });
      if (!category) throw new InternalServerError("500", "error creating category");
      return category;
    } catch (e) {
      // TODO: call exception handler, send error to sentry
      return this._serviceExceptionHandler(e);
    }
  }
  async fetchCategories(): Promise<ICategory[] | ApiErrors> {
    try {
      return await Category.find();
    } catch (e) {
      // TODO: call exception handler, send error to sentry
      return this._serviceExceptionHandler(e);
    }
  }

  private _serviceExceptionHandler(e: any): ApiErrors {
    if (<Object>e instanceof ApiErrors) return e as ApiErrors;
    return new InternalServerError("500", (e as unknown as Object).toString());
  }
}
