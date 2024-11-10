interface Post {
    _id: string;
    title: string;
    content: string;
    images: string[];
    account: {
        _id: string;
        username: string;
        name: string;
        profilePicture?: string;
    };
    upvotes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
    isVisible: boolean;
}

interface Comment {
    _id: string;
    content: string;
    post: string;
    commentedBy: {
        _id: string;
        username: string;
        name: string;
        profilePicture?: string;
    };
    isReplyToComment: boolean;
    createdAt: string;
    updatedAt: string;
    replies: Comment[];
}

interface Upvote {
    _id: string;
    account: {
        _id: string;
        username: string;
        name: string;
        profilePicture?: string;
    };
}

interface MyPost {
    _id: string;
    username: string;
    name: string;
    profilePicture: string;
    posts: Post[]
}


interface Profile {
    _id: string;
    username: string;
    name: string;
    email: string;
    profilePicture: string;
    followers: number;
    following: number;
    posts: number;
    createdAt: string;
}

export type {
    Post,
    MyPost,
    Profile,
    Comment,
    Upvote,
}