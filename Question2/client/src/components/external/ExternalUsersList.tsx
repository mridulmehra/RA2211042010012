import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchExternalUsers, fetchExternalUserPosts, fetchExternalPostComments } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { generateRandomImageUrl } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ExternalUsersList = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  
  // Fetch all external users
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['/api/external/users'],
    queryFn: fetchExternalUsers,
  });
  
  // Fetch posts for selected user
  const { 
    data: postsData, 
    isLoading: isLoadingPosts,
    error: postsError
  } = useQuery({
    queryKey: ['/api/external/users/posts', selectedUserId],
    queryFn: () => selectedUserId ? fetchExternalUserPosts(selectedUserId) : Promise.resolve({ posts: [] }),
    enabled: !!selectedUserId,
  });
  
  // Fetch comments for selected post
  const { 
    data: commentsData, 
    isLoading: isLoadingComments,
    error: commentsError
  } = useQuery({
    queryKey: ['/api/external/posts/comments', selectedPostId],
    queryFn: () => selectedPostId ? fetchExternalPostComments(selectedPostId) : Promise.resolve({ comments: [] }),
    enabled: !!selectedPostId,
  });
  
  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setSelectedPostId(null); // Reset selected post when user changes
  };
  
  // Handle post selection
  const handlePostSelect = (postId: number) => {
    setSelectedPostId(postId);
  };
  
  if (usersError) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-100">
        <h3 className="font-bold mb-2 text-lg">External API Users</h3>
        <div className="text-red-500">Error loading users: {(usersError as Error).message}</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-100">
      <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
        <i className="ri-global-line"></i> External API Users
      </h3>
      
      {/* Users List */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2 text-slate-700">All Users:</h4>
        {isLoadingUsers ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {usersData?.users && Object.entries(usersData.users).map(([id, name]) => (
              <button
                key={id}
                onClick={() => handleUserSelect(id)}
                className={`p-2 rounded-lg text-sm border flex items-center gap-2 ${
                  selectedUserId === id
                    ? "bg-primary border-primary text-white"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage 
                    src={generateRandomImageUrl(`external-user-${id}`)} 
                    alt={name as string} 
                  />
                  <AvatarFallback>
                    {(name as string).split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-left">{name}</div>
                  <div className={`text-xs ${selectedUserId === id ? 'text-white/75' : 'text-slate-500'}`}>ID: {id}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected User's Posts */}
      {selectedUserId && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage 
                src={generateRandomImageUrl(`external-user-${selectedUserId}`)} 
                alt={usersData?.users?.[selectedUserId] as string} 
              />
              <AvatarFallback>
                {((usersData?.users?.[selectedUserId] as string) || '').split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            Posts by {usersData?.users?.[selectedUserId]}:
          </h4>
          
          {postsError ? (
            <div className="text-red-500 mb-4">Error loading posts: {(postsError as Error).message}</div>
          ) : isLoadingPosts ? (
            <div className="space-y-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : !postsData?.posts?.length ? (
            <div className="text-center p-4 bg-slate-50 rounded-lg mb-4">
              <p className="text-slate-500">No posts found for this user</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {postsData.posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostSelect(post.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPostId === post.id
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage 
                        src={generateRandomImageUrl(`external-user-${selectedUserId}`)} 
                        alt={usersData?.users?.[selectedUserId] as string} 
                      />
                      <AvatarFallback>
                        {((usersData?.users?.[selectedUserId] as string) || '').split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{usersData?.users?.[selectedUserId]}</div>
                  </div>
                  <div className="text-slate-700">{post.content}</div>
                  <div className="text-xs text-slate-500 mt-2">Post ID: {post.id}</div>
                  {post.content.toLowerCase().includes('ocean') && (
                    <div className="mt-2 rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={`https://source.unsplash.com/featured/800x400/?ocean,sea,beach`} 
                        alt="Ocean image" 
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  {(post.content.toLowerCase().includes('animal') || 
                    post.content.toLowerCase().includes('monkey') || 
                    post.content.toLowerCase().includes('zebra') || 
                    post.content.toLowerCase().includes('elephant') || 
                    post.content.toLowerCase().includes('ant') || 
                    post.content.toLowerCase().includes('bat')) && (
                    <div className="mt-2 rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={`https://source.unsplash.com/featured/800x400/?animal,wildlife`} 
                        alt="Animal image" 
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  {(post.content.toLowerCase().includes('house') || 
                    post.content.toLowerCase().includes('igloo')) && (
                    <div className="mt-2 rounded-lg overflow-hidden shadow-md">
                      <img 
                        src={`https://source.unsplash.com/featured/800x400/?house,home,architecture`} 
                        alt="House image" 
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Selected Post's Comments */}
      {selectedPostId && (
        <div>
          <h4 className="text-sm font-semibold mb-2 text-slate-700">
            Comments on Post #{selectedPostId}:
          </h4>
          
          {commentsError ? (
            <div className="text-red-500">Error loading comments: {(commentsError as Error).message}</div>
          ) : isLoadingComments ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : !commentsData?.comments?.length ? (
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-500">No comments found for this post</p>
            </div>
          ) : (
            <div className="bg-slate-50 p-3 rounded-lg">
              {commentsData.comments.map((comment) => (
                <div key={comment.id} className="mb-2 last:mb-0 p-2 bg-white rounded border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage 
                        src={generateRandomImageUrl(`comment-user-${comment.id}`)} 
                        alt="Commenter" 
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-sm">Anonymous User</div>
                  </div>
                  <div>{comment.content}</div>
                  <div className="text-xs text-slate-500 mt-1">Comment ID: {comment.id}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExternalUsersList;