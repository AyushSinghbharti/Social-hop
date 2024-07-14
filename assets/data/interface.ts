interface Post {
  id: string;
  image: string;
  image_url: string;
  caption: string;
  user: User;
}

interface User {
  id: string;
  avatar_url: string;
  image_url: string;
  username: string;
}