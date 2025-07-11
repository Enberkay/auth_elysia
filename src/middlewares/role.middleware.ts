export const requireRole = (roles: string[]) =>
  (context: any) => {
    const { user, set } = context
    if (!user || !roles.includes(user.role)) {
      set.status = 403
      throw new Error('Forbidden: Insufficient role')
    }
  }
