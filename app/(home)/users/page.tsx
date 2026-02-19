import UsersDatatable from "@/components/datatable-users"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      </div>
      <UsersDatatable />
    </div>
  )
}
