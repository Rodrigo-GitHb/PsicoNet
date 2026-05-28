import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiRequest, clearTokens, getAccessToken, mediaUrl, setTokens } from '../services/api'
import { AppContext } from './AppContextObject'

function getInitials(user) {
  const source = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'U'
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase()
}

function formatDate(value) {
  if (!value) {
    return 'agora'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function normalizeUser(user) {
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username

  return {
    id: String(user.id),
    name,
    username: user.username,
    email: user.email || '',
    bio: user.bio || 'Perfil sem bio por enquanto.',
    avatar: getInitials(user),
    avatarUrl: mediaUrl(user.avatar),
    cover: 'linear-gradient(135deg, rgba(36, 87, 214, 0.92), rgba(216, 58, 46, 0.88))',
    followersCount: user.followers_count || 0,
    followingCount: user.following_count || 0,
    isFollowing: Boolean(user.is_following),
    location: user.location || 'Localizacao nao informada',
    website: user.website || '',
    joinedAt: formatDate(user.date_joined),
  }
}

function normalizeComment(comment) {
  const author = normalizeUser(comment.author)

  return {
    id: String(comment.id),
    author,
    authorId: author.id,
    content: comment.content,
    createdAt: formatDate(comment.created_at),
  }
}

function normalizePost(post) {
  const author = normalizeUser(post.author)

  return {
    id: String(post.id),
    author,
    authorId: author.id,
    content: post.content,
    image: mediaUrl(post.image),
    createdAt: formatDate(post.created_at),
    likesCount: post.likes_count || 0,
    commentsCount: post.comments_count || 0,
    isLiked: Boolean(post.is_liked),
    comments: (post.comments || []).map(normalizeComment),
  }
}

function uniquePosts(groups) {
  const byId = new Map()
  groups.flat().forEach((post) => byId.set(post.id, post))
  return [...byId.values()].sort((left, right) => Number(right.id) - Number(left.id))
}

function buildProfilePayload(payload) {
  const formData = new FormData()

  if (payload.name?.trim()) {
    const [firstName, ...lastName] = payload.name.trim().split(/\s+/)
    formData.append('first_name', firstName)
    formData.append('last_name', lastName.join(' '))
  }

  if (payload.bio?.trim()) {
    formData.append('bio', payload.bio.trim())
  }

  if (payload.location?.trim()) {
    formData.append('location', payload.location.trim())
  }

  if (payload.website?.trim()) {
    formData.append('website', payload.website.trim())
  }

  if (payload.avatar) {
    formData.append('avatar', payload.avatar)
  }

  if (payload.oldPassword || payload.newPassword) {
    formData.append('old_password', payload.oldPassword)
    formData.append('new_password', payload.newPassword)
  }

  return formData
}

export function AppProvider({ children }) {
  const [token, setToken] = useState(getAccessToken())
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [timeline, setTimeline] = useState([])
  const [followingUsers, setFollowingUsers] = useState([])
  const [followerUsers, setFollowerUsers] = useState([])
  const [authMode, setAuthMode] = useState('login')
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState('')

  const refreshSession = useCallback(async () => {
    if (!getAccessToken()) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const [meData, feedData, exploreData, ownPostsData, usersData] = await Promise.all([
        apiRequest('/auth/me/'),
        apiRequest('/posts/feed/'),
        apiRequest('/posts/explore/'),
        apiRequest('/posts/'),
        apiRequest('/auth/users/'),
      ])

      const me = normalizeUser(meData)
      const feedPosts = feedData.map(normalizePost)
      const explorePosts = exploreData.map(normalizePost)
      const ownPosts = ownPostsData.map(normalizePost)

      setCurrentUser(me)
      setTimeline(feedPosts)
      setPosts(uniquePosts([ownPosts, feedPosts, explorePosts]))
      setUsers(usersData.map(normalizeUser))

      const [followingData, followersData] = await Promise.all([
        apiRequest(`/auth/users/${me.username}/following/`),
        apiRequest(`/auth/users/${me.username}/followers/`),
      ])
      setFollowingUsers(followingData.map(normalizeUser))
      setFollowerUsers(followersData.map(normalizeUser))
    } catch (requestError) {
      clearTokens()
      setToken(null)
      setCurrentUser(null)
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => {
      refreshSession()
    })
  }, [refreshSession, token])

  async function login(credentials) {
    const tokens = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    setTokens(tokens)
    setToken(tokens.access)
    await refreshSession()
  }

  async function register(payload) {
    const tokens = await apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    setTokens(tokens)
    setToken(tokens.access)
    await refreshSession()
  }

  function logout() {
    clearTokens()
    setToken(null)
    setCurrentUser(null)
    setUsers([])
    setPosts([])
    setTimeline([])
    setFollowingUsers([])
    setFollowerUsers([])
  }

  async function toggleLike(postId) {
    const result = await apiRequest(`/posts/${postId}/like/`, { method: 'POST' })
    const updatePost = (post) =>
      post.id === String(postId)
        ? {
            ...post,
            isLiked: result.is_liked,
            likesCount: result.likes_count,
          }
        : post

    setPosts((items) => items.map(updatePost))
    setTimeline((items) => items.map(updatePost))
  }

  async function addComment(postId, content) {
    if (!content.trim()) {
      return
    }

    const comment = await apiRequest(`/posts/${postId}/comments/`, {
      method: 'POST',
      body: JSON.stringify({ content: content.trim() }),
    })
    const normalizedComment = normalizeComment(comment)
    const updatePost = (post) =>
      post.id === String(postId)
        ? {
            ...post,
            comments: [...post.comments, normalizedComment],
            commentsCount: post.commentsCount + 1,
          }
        : post

    setPosts((items) => items.map(updatePost))
    setTimeline((items) => items.map(updatePost))
  }

  async function createPost(content) {
    if (!content.trim()) {
      return
    }

    const post = await apiRequest('/posts/', {
      method: 'POST',
      body: JSON.stringify({ content: content.trim() }),
    })
    setPosts((items) => [normalizePost(post), ...items])
  }

  async function toggleFollow(targetUserId) {
    const target = users.find((user) => user.id === String(targetUserId))
    if (!target) {
      return
    }

    await apiRequest(`/auth/users/${target.username}/follow/`, { method: 'POST' })
    await refreshSession()
  }

  async function updateProfile(payload) {
    await apiRequest('/auth/me/', {
      method: 'PATCH',
      body: buildProfilePayload(payload),
    })
    await refreshSession()
  }

  const discoverUsers = useMemo(
    () => users.filter((user) => !user.isFollowing),
    [users],
  )

  const value = {
    authMode,
    currentUser,
    discoverUsers,
    error,
    followerUsers,
    followingUsers,
    isAuthenticated: Boolean(currentUser),
    loading,
    posts,
    timeline,
    users,
    addComment,
    createPost,
    login,
    logout,
    register,
    refreshSession,
    setAuthMode,
    setError,
    toggleFollow,
    toggleLike,
    updateProfile,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
