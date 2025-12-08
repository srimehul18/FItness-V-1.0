// app/community/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AuthGuard from "../../components/auth-guard";
import Card from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import {
  Heart,
  MessageCircle,
  Flame,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

type Post = {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  author_name: string | null;
  author_avatar_url: string | null;
  created_at: string;
};

type LikeRow = {
  post_id: string;
  user_id: string;
};

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  author_name: string | null;
  author_avatar_url: string | null;
  created_at: string;
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hr${diffH > 1 ? "s" : ""} ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} day${diffD > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function getTopicFromContent(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "New achievement";
  // take first ~50 chars as a "topic"
  const slice = trimmed.slice(0, 50);
  return slice.length < trimmed.length ? `${slice}…` : slice;
}

function CommunityContent() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Athlete");
  const [userAvatar, setUserAvatar] = useState<string>("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<LikeRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [selectedPostForComments, setSelectedPostForComments] =
    useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  const [tab, setTab] = useState<"feed" | "trending">("feed");

  // 🔁 client-side reposts (no DB yet)
  const [repostCounts, setRepostCounts] = useState<Record<string, number>>({});
  const [userRepostedPostIds, setUserRepostedPostIds] = useState<Set<string>>(
    new Set()
  );

  // Load user from Supabase Auth
  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const meta: any = user.user_metadata || {};
      const fullName =
        meta.full_name || meta.name || user.email?.split("@")[0] || "Athlete";
      setUserName(fullName);

      const googleAvatar: string | undefined = meta.avatar_url;
      const initialsSource = fullName || user.email || "User";
      const fallbackAvatar = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
        initialsSource
      )}`;
      const avatarUrl = googleAvatar || fallbackAvatar;
      setUserAvatar(avatarUrl);
    }

    loadUser();
  }, []);

  // Initial load
  useEffect(() => {
    async function loadInitial() {
      setLoading(true);

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!postsError && postsData) setPosts(postsData as Post[]);

      const { data: likesData, error: likesError } = await supabase
        .from("post_likes")
        .select("post_id, user_id");
      if (!likesError && likesData) setLikes(likesData as LikeRow[]);

      const { data: commentsData, error: commentsError } = await supabase
        .from("post_comments")
        .select("*")
        .order("created_at", { ascending: true });
      if (!commentsError && commentsData)
        setComments(commentsData as CommentRow[]);

      setLoading(false);
    }

    loadInitial();
  }, []);

  // Realtime updates
  useEffect(() => {
    const postsChannel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const newPost = (payload as any).new as Post | undefined;
          if (!newPost) return;
          setPosts((prev) => [newPost, ...prev]);
        }
      )
      .subscribe();

    const likesChannel = supabase
      .channel("likes-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "post_likes" },
        (payload) => {
          const newLike = (payload as any).new as LikeRow | undefined;
          if (!newLike) return;
          setLikes((prev) => [...prev, newLike]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "post_likes" },
        (payload) => {
          const oldLike = (payload as any).old as LikeRow | undefined;
          if (!oldLike) return;
          setLikes((prev) =>
            prev.filter(
              (l) =>
                !(
                  l.post_id === oldLike.post_id && l.user_id === oldLike.user_id
                )
            )
          );
        }
      )
      .subscribe();

    const commentsChannel = supabase
      .channel("comments-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "post_comments" },
        (payload) => {
          const newCommentRow = (payload as any).new as CommentRow | undefined;
          if (!newCommentRow) return;
          setComments((prev) => [...prev, newCommentRow]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(commentsChannel);
    };
  }, []);

  const postsWithMeta = useMemo(() => {
    return posts.map((p) => {
      const postLikes = likes.filter((l) => l.post_id === p.id);
      const likeCount = postLikes.length;
      const userHasLiked =
        userId != null && postLikes.some((l) => l.user_id === userId);
      const postComments = comments.filter((c) => c.post_id === p.id);

      return {
        ...p,
        likeCount,
        userHasLiked,
        commentCount: postComments.length,
      };
    });
  }, [posts, likes, comments, userId]);

  const trendingPosts = useMemo(
    () => [...postsWithMeta].sort((a, b) => b.likeCount - a.likeCount),
    [postsWithMeta]
  );

  const uniqueAuthors = useMemo(
    () => new Set(posts.map((p) => p.user_id)).size,
    [posts]
  );

  // Derived "topics" for Trending Now (top 3 posts)
  const trendingTopics = useMemo(
    () =>
      trendingPosts.slice(0, 3).map((p) => ({
        topic: getTopicFromContent(p.content),
        score: p.likeCount + (repostCounts[p.id] ?? 0),
      })),
    [trendingPosts, repostCounts]
  );

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (!content.trim() && !file) return;

    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const filePath = `${userId}/${Date.now()}.${fileExt ?? "jpg"}`;

        const { error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading image:", uploadError);
        } else {
          const { data } = supabase.storage
            .from("post-images")
            .getPublicUrl(filePath);
          imageUrl = data.publicUrl;
        }
      }

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: userId,
        content: content.trim(),
        image_url: imageUrl,
        author_name: userName,
        author_avatar_url: userAvatar,
      });

      if (insertError) {
        console.error("Error creating post:", insertError);
      } else {
        setContent("");
        setFile(null);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleLike(postId: string) {
    if (!userId) return;
    const existing = likes.find(
      (l) => l.post_id === postId && l.user_id === userId
    );

    if (existing) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
      if (error) console.error("Error unliking:", error);
    } else {
      const { error } = await supabase
        .from("post_likes")
        .insert({ post_id: postId, user_id: userId });
      if (error) console.error("Error liking:", error);
    }
  }

  // 🔁 local-only repost toggle
  function toggleRepost(postId: string) {
    setRepostCounts((prev) => {
      const current = prev[postId] ?? 0;
      const hasReposted = userRepostedPostIds.has(postId);
      const nextCount = hasReposted ? Math.max(current - 1, 0) : current + 1;
      return { ...prev, [postId]: nextCount };
    });

    setUserRepostedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  }

  async function submitComment(postId: string) {
    if (!userId || !newComment.trim()) return;

    const { error } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: userId,
      content: newComment.trim(),
      author_name: userName,
      author_avatar_url: userAvatar,
    });

    if (error) {
      console.error("Error inserting comment:", error);
      return;
    }
    setNewComment("");
  }

  const stripeColors = ["bg-blue-500", "bg-red-500", "bg-purple-500"];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Page header */}
        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            Community
          </h1>
          <p className="text-sm text-muted-foreground">
            Share your wins, ask questions, and cheer on other athletes.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[2.2fr,1fr] gap-6">
          {/* LEFT COLUMN */}
          <section className="space-y-6">
            {/* Composer */}
            <Card className="p-4 premium-shadow">
              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your latest workout, achievement, or question…"
                    className="flex-1 min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <span>{file ? file.name : "Add a photo"}</span>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setFile(f);
                      }}
                    />
                  </label>

                  <Button
                    type="submit"
                    disabled={submitting || (!content.trim() && !file)}
                    className="rounded-full px-5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    {submitting ? "Posting…" : "Post achievement"}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Tabs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTab("feed")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                  tab === "feed"
                    ? "bg-foreground text-background"
                    : "bg-background text-muted-foreground"
                }`}
              >
                For You
              </button>
              <button
                onClick={() => setTab("trending")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 ${
                  tab === "trending"
                    ? "bg-foreground text-background"
                    : "bg-background text-muted-foreground"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Trending
              </button>
            </div>

            {/* FEED */}
            {loading && (
              <p className="text-xs text-muted-foreground">Loading posts…</p>
            )}
            {!loading && postsWithMeta.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No posts yet. Be the first to share something!
              </p>
            )}

            <div className="space-y-4">
              {(tab === "feed" ? postsWithMeta : trendingPosts).map(
                (post, index) => {
                  const authorAvatar =
                    post.author_avatar_url ||
                    `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
                      post.author_name ?? "Athlete"
                    )}`;

                  const stripe =
                    stripeColors[index % stripeColors.length];
                  const repostCount = repostCounts[post.id] ?? 0;
                  const hasReposted = userRepostedPostIds.has(post.id);

                  return (
                    <Card
                      key={post.id}
                      className="p-0 premium-shadow animate-slideInUp overflow-hidden"
                    >
                      {/* colored stripe */}
                      <div className={`h-1 w-full ${stripe}`} />

                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            <img
                              src={authorAvatar}
                              alt={post.author_name ?? "User"}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="font-semibold text-sm">
                                  {post.author_name ?? "Athlete"}
                                </div>
                                <div className="text-[11px] text-muted-foreground">
                                  {formatTimeAgo(post.created_at)}
                                </div>
                              </div>
                            </div>

                            <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">
                              {post.content}
                            </p>

                            {post.image_url && (
                              <div className="mt-3 rounded-xl overflow-hidden border bg-muted/40">
                                {/* keep aspect ratio, no warping */}
                                <img
                                  src={post.image_url}
                                  alt="Post"
                                  className="w-full h-auto max-h-[320px] object-cover"
                                />
                              </div>
                            )}

                            {/* Actions row */}
                            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                              {/* ❤️ Like */}
                              <button
                                onClick={() => toggleLike(post.id)}
                                className="inline-flex items-center gap-1 hover:text-rose-500 transition-colors"
                              >
                                <Heart
                                  className={`w-4 h-4 transition-transform ${
                                    post.userHasLiked
                                      ? "fill-rose-500 text-rose-500 scale-110"
                                      : ""
                                  }`}
                                />
                                <span>{post.likeCount || 0}</span>
                              </button>

                              {/* 🔁 Repost (client-side for now) */}
                              <button
                                onClick={() => toggleRepost(post.id)}
                                className="inline-flex items-center gap-1 hover:text-blue-500 transition-colors"
                              >
                                <span
                                  className={`text-sm leading-none transition-transform ${
                                    hasReposted
                                      ? "text-blue-500 scale-110"
                                      : ""
                                  }`}
                                >
                                  🔁
                                </span>
                                <span>{repostCount}</span>
                              </button>

                              {/* 💬 Comments */}
                              <button
                                onClick={() =>
                                  setSelectedPostForComments(post)
                                }
                                className="inline-flex items-center gap-1 hover:text-blue-500 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.commentCount || 0}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Comments section */}
                        {selectedPostForComments?.id === post.id && (
                          <div className="mt-4 border-t pt-3 space-y-3">
                            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              Comments
                            </div>

                            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                              {comments
                                .filter((c) => c.post_id === post.id)
                                .map((c) => (
                                  <div
                                    key={c.id}
                                    className="flex items-start gap-2 text-xs"
                                  >
                                    <div className="w-7 h-7 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                                      {c.author_avatar_url ? (
                                        <img
                                          src={c.author_avatar_url}
                                          alt={c.author_name ?? "User"}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-[10px] font-semibold">
                                          {(c.author_name ?? "U")
                                            .charAt(0)
                                            .toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                    <div className="bg-muted/40 rounded-xl px-3 py-2 flex-1">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold text-[11px]">
                                          {c.author_name ?? "User"}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          {formatTimeAgo(c.created_at)}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-[11px] text-foreground">
                                        {c.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}

                              {comments.filter(
                                (c) => c.post_id === post.id
                              ).length === 0 && (
                                <p className="text-[11px] text-muted-foreground">
                                  No comments yet. Start the conversation!
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <Textarea
                                value={newComment}
                                onChange={(e) =>
                                  setNewComment(e.target.value)
                                }
                                placeholder="Write a comment…"
                                className="min-h-[40px] max-h-[80px] resize-none text-xs"
                              />
                              <Button
                                type="button"
                                className="rounded-full text-xs px-3 h-[32px]"
                                onClick={() => submitComment(post.id)}
                              >
                                Post
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                }
              )}
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4">
            {/* Smaller stats card like mock */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Community Stats</h3>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {uniqueAuthors || 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  active members
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {posts.length} posts shared so far.
              </p>
            </Card>

            {/* Dynamic trending topics */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-2">Trending Now</h3>
              {trendingTopics.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No trending topics yet. Post something awesome!
                </p>
              ) : (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {trendingTopics.map((t, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span>{t.topic}</span>
                      <span className="text-[11px] text-blue-500">
                        {t.score} pts
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Invite card */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-2">Invite Friends</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Bring your friends to keep each other accountable.
              </p>
              <Button className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
                Get Invite Link
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <AuthGuard>
      <CommunityContent />
    </AuthGuard>
  );
}
