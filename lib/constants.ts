export const MAIN_POST_ID = 'cm0rtq19v00015t1mkv0benln'
export const POSTS_PER_PAGE = 6

export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'auth_required',
  POST_NOT_FOUND: 'post_not_found',
  BOOKMARK_LIMIT_EXCEEDED: 'bookmark_limit_exceeded'
} as const

export const ERROR_DESCRIPTIONS = {
  [ERROR_MESSAGES.AUTH_REQUIRED]: 'You need to be logged in',
  [ERROR_MESSAGES.POST_NOT_FOUND]:
    "The post you're trying to bookmark doesn't exist",
  [ERROR_MESSAGES.BOOKMARK_LIMIT_EXCEEDED]:
    'You can only bookmark up to 10 posts',
  DEFAULT: 'Something went wrong while saving bookmark'
} as const
