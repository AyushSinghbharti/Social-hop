export default interface Post {
  id: string;
  image: string;
  image_url: string;
  caption: string;
  user: User;
  media_type: string;
}

export interface User {
  id: string;
  avatar_url: string;
  image_url: string;
  username: string;
}