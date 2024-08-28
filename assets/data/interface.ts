export default interface Post {
  id: string;
  image: string;
  image_url: string;
  caption: string;
  user: User;
  media_type: string;
  my_likes: likes[];
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  avatar_url: string;
  image_url: string;
  username: string;
  bio?: any;
  website?: any;
  full_name?: any;
  updated_at: string;
}

export interface likes {
  id: number;
  post_id: number;
  user_id: string;
  created_at: string;
}