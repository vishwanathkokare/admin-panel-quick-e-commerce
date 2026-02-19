import { type User } from '@/components/datatable-users'

const usersData: User[] = [
  {
    id: 'USR-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://github.com/shadcn.png',
  },
  {
    id: 'USR-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    avatar: 'https://github.com/shadcn.png',
  },
  {
    id: 'USR-3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
    avatar: '',
  },
]

export default usersData