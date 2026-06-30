import { get, post, put, del } from "../../api/client";

// Example entity type — replace with your own
export interface Example {
  id: string;
  name: string;
  createdAt: string;
}

// Example service — replace with your own domain services
export const exampleService = {
  async getAll(): Promise<Example[]> {
    return get<Example[]>("/examples");
  },

  async getById(id: string): Promise<Example> {
    return get<Example>(`/examples/${id}`);
  },

  async create(data: Omit<Example, "id" | "createdAt">): Promise<Example> {
    return post<Example>("/examples", data);
  },

  async update(id: string, data: Partial<Example>): Promise<Example> {
    return put<Example>(`/examples/${id}`, data);
  },

  async remove(id: string): Promise<void> {
    return del<void>(`/examples/${id}`);
  },
};
