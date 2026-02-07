'use client'

import { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon } from 'lucide-react'

import type { ColumnDef, PaginationState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { usePagination } from '@/hooks/use-pagination'

import DialogOrder from '@/components/dialog-order'

export type OrderItem = {
  id: string
  productName: string
  quantity: number
  price: number  
}

export type OrderItems = OrderItem[]

export type OrderStatus =
  | 'accepted'
  | 'processing'
  | 'delivering'
  | 'delivered'
  | 'canceled'

export type PaymentMethod = 'cash' | 'upi'


export type Item = {
  id: string
  avatar: string
  avatarFallback: string
  name: string

  orderItems: OrderItems

  phoneNumber: string
  address: string

  amount: number // total amount (derived from items)

  status: OrderStatus
  paidBy: PaymentMethod
}

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: 'id',
    header: 'Order Id',
    cell: ({ row }) => {
      const id = row.original.id

      return <span>{id}</span>
    },
  },
   {
    accessorKey: 'name',
    header: 'Customer',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-9">
          <AvatarImage
            src={row.original.avatar}
            alt={row.original.name}
          />
          <AvatarFallback className="text-xs">
            {row.original.avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col text-sm">
          <span className="font-medium text-card-foreground">
            {row.original.name}
          </span>
          <span className="text-muted-foreground">
            {row.original.phoneNumber}
          </span>
        </div>
      </div>
    ),
  },
    {
  accessorKey: 'orderItems',
  header: 'Order Items',
  cell: ({ row }) => {
    const orderItems = row.original.orderItems

    return (
      <div className="flex flex-col gap-1 text-sm">
        {orderItems && orderItems.map(orderItem => (
          <div key={orderItem.id} className="flex gap-2">
            <span className="font-medium">{orderItem.productName}</span>
            <span className="text-muted-foreground">{orderItem.quantity > 1 && (<>x {orderItem.quantity}</>)}</span>
            <span>
              - ₹{orderItem.price}
            </span>
          </div>
        ))}
      </div>
    )
  },
},


  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => {
      const address = row.original.address

      return <span>{address}</span>
    },
  },

  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = row.original.amount

      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount)

      return (<span>{formatted}</span>)
    },
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status

      const statusColorMap: Record<typeof status, string> = {
        accepted: 'bg-blue-100 text-blue-700',
        processing: 'bg-yellow-100 text-yellow-700',
        delivering: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        canceled: 'bg-red-100 text-red-700',
      }

      return (
        <Badge
          className={`rounded-sm px-2 capitalize ${statusColorMap[status]}`}
        >
          {status}
        </Badge>
      )
    },
  },

  {
    accessorKey: 'paidBy',
    header: 'Paid by',
    cell: ({ row }) => (
      <span className="capitalize text-sm font-medium">
        {row.original.paidBy}
      </span>
    ),
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({row}) => <RowActions Id={row.original.id} Name={row.original.name} PhoneNumber={row.original.phoneNumber} Address={row.original.address} Amount={row.original.amount} Status={row.original.status} PaidBy={row.original.paidBy} OrderItems={row.original.orderItems}  />,
    size: 60,
    enableHiding: false,
  },
]

const OrdersDatatable = ({ data }: { data: Item[] }) => {
  const pageSize = 5

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    }
  })

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 2
  })

  return (
    <div className='w-full'>
      <div className='border-b'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className='text-muted-foreground h-14 first:pl-4'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className='first:pl-4'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between gap-3 px-6 py-4 max-sm:flex-col md:max-lg:flex-col'>
        <p className='text-muted-foreground text-sm whitespace-nowrap' aria-live='polite'>
          Showing{' '}
          <span>
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              Math.max(
                table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                  table.getState().pagination.pageSize,
                0
              ),
              table.getRowCount()
            )}
          </span>{' '}
          of <span>{table.getRowCount().toString()} entries</span>
        </p>

        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  className='disabled:pointer-events-none disabled:opacity-50'
                  variant={'ghost'}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label='Go to previous page'
                >
                  <ChevronLeftIcon aria-hidden='true' />
                  Previous
                </Button>
              </PaginationItem>

              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {pages.map(page => {
                const isActive = page === table.getState().pagination.pageIndex + 1

                return (
                  <PaginationItem key={page}>
                    <Button
                      size='icon'
                      className={`${!isActive && 'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40'}`}
                      onClick={() => table.setPageIndex(page - 1)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                )
              })}

              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <Button
                  className='disabled:pointer-events-none disabled:opacity-50'
                  variant={'ghost'}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label='Go to next page'
                >
                  Next
                  <ChevronRightIcon aria-hidden='true' />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default OrdersDatatable

function RowActions({
  Id,
  Name,
  Amount,
  Address,
  PhoneNumber,
  PaidBy,
  Status,
  OrderItems,
}:{Id:string,Name:string,Amount:number,Address:string,PhoneNumber:string,Status:OrderStatus,OrderItems:OrderItems,PaidBy:string}) {

  const deleteOrder = async () => {
    await fetch(`http://127.0.0.1:3000/api/orders?id=${Id}`,{
      method: "DELETE",
    })
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full">
          <EllipsisVerticalIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <DialogOrder
              Id={Id}
              Name={Name}
              Amount={Amount}
              Address={Address}
              PhoneNumber={PhoneNumber}
              PaidBy={PaidBy}
              Status={Status}
              OrderItems={OrderItems}
            />
          </DropdownMenuItem>

          <DropdownMenuItem variant="destructive" onClick={deleteOrder}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
