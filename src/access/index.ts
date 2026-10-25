import type { Access, FieldAccess } from 'payload'

type Role = 'owner' | 'admin' | 'editor'

const hasRole = (user: unknown, ...roles: Role[]) =>
  !!user && roles.includes((user as { role?: Role }).role as Role)

/** Treść widzi każdy, ale wersje robocze tylko zalogowani (podgląd przed publikacją). */
export const publishedOrLoggedIn: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: 'published' } }

export const anyone: Access = () => true
export const editors: Access = ({ req: { user } }) => hasRole(user, 'owner', 'admin', 'editor')
export const admins: Access = ({ req: { user } }) => hasRole(user, 'owner', 'admin')
export const adminsField: FieldAccess = ({ req: { user } }) => hasRole(user, 'owner', 'admin')

/** Konta panelu zakłada, usuwa i nadaje role tylko właściciel (Michał). */
export const owner: Access = ({ req: { user } }) => hasRole(user, 'owner')
export const ownerField: FieldAccess = ({ req: { user } }) => hasRole(user, 'owner')
