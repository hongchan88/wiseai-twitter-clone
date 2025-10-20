import { Post, User } from '@/types';

export const currentUser: User = {
  id: "user123",
  name: "내 이름",
  username: "myusername",
  profileImage: "https://picsum.photos/40/40?random=99",
  verified: false
};

export const generateMockPosts = (count: number = 50): Post[] => {
  const posts: Post[] = [];
  const mockUsers: User[] = [
    { id: "1", name: "김개발", username: "kimdev", profileImage: "https://picsum.photos/40/40?random=1", verified: true },
    { id: "2", name: "이디자인", username: "leedesign", profileImage: "https://picsum.photos/40/40?random=2", verified: false },
    { id: "3", name: "박기효", username: "parkux", profileImage: "https://picsum.photos/40/40?random=3", verified: true },
    { id: "4", name: "최프론트", username: "choifront", profileImage: "https://picsum.photos/40/40?random=4", verified: false },
    { id: "5", name: "정백엔드", username: "jungbackend", profileImage: "https://picsum.photos/40/40?random=5", verified: true },
  ];

  const mockContents = [
    "오늘 React 18의 새로운 기능들을 공부했습니다! Concurrent Features가 정말 흥미롭네요 🚀 #React #개발자",
    "새로운 디자인 시스템을 만들고 있어요. 일관성 있는 컴포넌트 라이브러리의 중요성을 다시 한번 느낍니다 ✨",
    "타입스크립트로 프로젝트를 마이그레이션 중입니다. 처음에는 귀찮았는데 지금은 없으면 못 살겠어요 🔥",
    "코드 리뷰 문화가 정말 중요하다는 걸 깨달았어요. 동료들과 함께 성장하는 즐거움 💪",
    "새로운 맥북 프로를 써보니 개발 속도가 확 올랐어요. 투자는 가치가 있네요 🍎",
    "오늘은 알고리즘 문제 풀면서 자료구조 복습했습니다. 기본기가 중요하더라고요 📚",
    "UI/UX 트렌드를 계속 따라가는 게 쉽지 않네요. 하지만 사용자를 위한 노력은 멈출 수 없죠 🎨",
    "팀원들과 함께 코드 컨벤션 정리했습니다. 일관성 있는 코드가 정말 중요하네요 📝",
    "Next.js 14 앱 라우터 구조에 익숙해지고 있습니다. 서버 컴포넌트는 정말 혁신적이에요 ⚡",
    "주말에도 코딩하는 즐거움! 만들고 있는 걸 보며 뿌듯함을 느껴요 😊",
  ];

  for (let i = 1; i <= count; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const content = mockContents[Math.floor(Math.random() * mockContents.length)];
    const hasImages = Math.random() > 0.6;

    posts.push({
      id: i,
      author: user,
      content,
      images: hasImages ? [`https://picsum.photos/500/300?random=${i + 100}`] : [],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 100),
      retweets: Math.floor(Math.random() * 30),
      comments: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.7,
      isRetweeted: Math.random() > 0.8,
    });
  }

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const mockPosts = generateMockPosts();