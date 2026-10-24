import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'editor'

const hasRole = (user: unknown, ...roles: Role[]) =>
  !!user && roles.includes((user as { role?: Role }).role as Role)

/** Treść widzi każdy, ale wersje robocze tylko zalogowani (podgląd przed publikacją). */
export const publishedOrLoggedIn: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: 'published' } }

export const anyone: Access = () => true
export const editors: Access = ({ req: { user } }) => hasRole(user, 'admin', 'editor')
export const admins: Access = ({ req: { user } }) => hasRole(user, 'admin')
export const adminsField: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')
