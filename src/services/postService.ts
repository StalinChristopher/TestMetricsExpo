import { get } from "../api/client";
import { ApiEndpoints } from "../api/endpoints";
import { Post } from "../api/types/api";

export const postService = {
  async getPosts(): Promise<Post[]> {
    return get(ApiEndpoints.posts.list());
  },
};
