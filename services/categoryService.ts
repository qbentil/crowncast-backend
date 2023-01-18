import { Category } from "../models";
import { ICategory, ICategoryParam } from "../types";

export interface ICategoryService<T> {
  findCategoryByTitleAndEvent(query: ICategoryParam): Promise<T | null>;
  createCategory(): Promise<T | null>;
  fetchCategories(): Promise<T[] | null>;
}

export class CategoryService implements ICategoryService<ICategory> {
  async findCategoryByTitleAndEvent(query: ICategoryParam): Promise<ICategory | null> {
    const { title, event } = query;
    let category;
    try {
      category = await Category.findOne({ title, event });
      if (!category) throw new Error("category not found");
      return category;
    } catch (error) {
      // TODO: call exception handler, send error to sentry
      return null;
    }
  }
  createCategory(): Promise<ICategory | null> {
    throw new Error("Method not implemented.");
  }
  fetchCategories(): Promise<ICategory[] | null> {
    throw new Error("Method not implemented.");
  }
}
