// src/app/page.tsx
import AuthStatusDisplay from '@/components/Auth/AuthStatusDisplay';
import PostList from '@/components/posts/PostList';
import { Post, PostAuthor } from '@/types/post';

const generateDummyPosts = (count: number): Post[] => {
  const posts: Post[] = [];
  const authors: PostAuthor[] = [
    { id: 'u1', name: 'Alice Wonderland', avatarUrl: '/img/avatars/alice.png' },
    { id: 'u2', name: 'Bob The Builder', avatarUrl: '/img/avatars/bob.png' },
    { id: 'u3', name: 'Charlie Brown', avatarUrl: '/img/avatars/charlie.png' },
  ];

  for (let i = 1; i <= count; i++) {
    const author = authors[i % authors.length];
    posts.push({
      id: `post${i}`,
      author,
      contentText: `This is dummy post number ${i} from ${author.name}. Exploring Kasese Socials today! It's quite exciting to see things develop. #KaseseDev #SocialMedia`,
      contentImageUrl: i % 2 === 0 ? `/img/posts/sample${(i % 3) + 1}.jpg` : undefined,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * i * 0.5),
      likes: Math.floor(Math.random() * 100),
      commentsCount: Math.floor(Math.random() * 20),
    });
  }
  return posts;
};

const DUMMY_POSTS: Post[] = generateDummyPosts(5);

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-700">Welcome to Kasese Socials!</h1>
        <p className="text-lg text-gray-600 mt-2">Connect, share, and discover.</p>
      </div>

      <section aria-labelledby="feed-heading">
        <h2 id="feed-heading" className="text-2xl font-semibold text-gray-800 mb-6 sr-only">
          Recent Posts
        </h2>
        <PostList posts={DUMMY_POSTS} />
      </section>

      <div className="mt-12 p-4 border-t border-gray-200">
        <AuthStatusDisplay />
      </div>
    </div>
  );
}
