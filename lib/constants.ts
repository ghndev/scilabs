export const MAIN_POST_ID = 'cm0rtq19v00015t1mkv0benln'
export const POSTS_PER_PAGE = 6
export const COMMENTS_PER_PAGE = 10
export const COMMENT_MAX_LENGTH = 500
export const USERNAME_MAX_LENGTH = 10
export const BIO_MAX_LENGTH = 260

export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'auth_required',
  POST_NOT_FOUND: 'post_not_found',
  COMMENT_NOT_FOUND: 'comment_not_found',
  BOOKMARK_LIMIT_EXCEEDED: 'bookmark_limit_exceeded'
} as const

export const ERROR_DESCRIPTIONS = {
  [ERROR_MESSAGES.AUTH_REQUIRED]: 'You need to be logged in',
  [ERROR_MESSAGES.POST_NOT_FOUND]: "The post doesn't exist",
  [ERROR_MESSAGES.COMMENT_NOT_FOUND]: "The comment doesn't exist",
  [ERROR_MESSAGES.BOOKMARK_LIMIT_EXCEEDED]:
    'You can only bookmark up to 10 posts',
  DEFAULT: 'Something went wrong while saving bookmark'
} as const
