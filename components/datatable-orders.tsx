"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
  ExpandedState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ChevronRight, MoreHorizontal, Plus, Pencil, Trash2, Loader2, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export type OrderItem = {
  itemId: string | number
  itemName: string
  itemQuantity: number
  itemPrice: number
  itemImg?: string
}

export type Item = {
  id: string
  avatar?: string
  avatarFallback?: string
  name: string
  orderItems: OrderItem[]
  phoneNumber: string
  address: string
  amount: number
  status: 'accepted' | 'processing' | 'delivering' | 'delivered' | 'canceled'
  paidBy: 'upi' | 'cash'
}

export default function OrdersDatatable() {
  const [data, setData] = React.useState<Item[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [currentOrder, setCurrentOrder] = React.useState<Partial<Item>>({})
  const [isEditMode, setIsEditMode] = React.useState(false)

  const fetchOrders = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error("Failed to fetch orders", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return

    try {
      const response = await fetch(`/api/orders?id=${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Failed to delete order", error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = isEditMode ? "PUT" : "POST"
      const url = isEditMode ? `/api/orders?id=${currentOrder.id}` : "/api/orders"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentOrder),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchOrders()
        setCurrentOrder({})
      }
    } catch (error) {
      console.error("Failed to save order", error)
    }
  }

  const openAddDialog = () => {
    setIsEditMode(false)
    setCurrentOrder({
      status: 'accepted',
      paidBy: 'cash',
      amount: 0,
      orderItems: [],
      name: '',
      phoneNumber: '',
      address: ''
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (order: Item) => {
    setIsEditMode(true)
    setCurrentOrder({ ...order })
    setIsDialogOpen(true)
  }

  const handleAddItem = () => {
    const newItem: OrderItem = {
      itemId: `new-${Date.now()}`,
      itemName: "New Item",
      itemQuantity: 1,
      itemPrice: 0,
      itemImg: "",
    }
    const newItems = [...(currentOrder.orderItems || []), newItem]
    const newAmount = newItems.reduce((acc, item) => acc + (item.itemPrice * item.itemQuantity), 0)
    setCurrentOrder({ ...currentOrder, orderItems: newItems, amount: newAmount })
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...(currentOrder.orderItems || [])]
    newItems.splice(index, 1)
    const newAmount = newItems.reduce((acc, item) => acc + (item.itemPrice * item.itemQuantity), 0)
    setCurrentOrder({ ...currentOrder, orderItems: newItems, amount: newAmount })
  }

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...(currentOrder.orderItems || [])]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === 'itemPrice' || field === 'itemQuantity') {
       const newAmount = newItems.reduce((acc, item) => acc + (item.itemPrice * item.itemQuantity), 0)
       setCurrentOrder({ ...currentOrder, orderItems: newItems, amount: newAmount })
    } else {
       setCurrentOrder({ ...currentOrder, orderItems: newItems })
    }
  }

  const columns: ColumnDef<Item>[] = [
    {
      id: "expander",
      header: () => null,
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          <button
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: "pointer" },
            }}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : null
      },
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "orderItems",
      header: "Items",
      cell: ({ row }) => {
        const items = row.original.orderItems || []
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{items.length} items</span>
          </div>
        )
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const colors: Record<string, string> = {
          accepted: "bg-blue-100 text-blue-800",
          processing: "bg-yellow-100 text-yellow-800",
          delivering: "bg-purple-100 text-purple-800",
          delivered: "bg-green-100 text-green-800",
          canceled: "bg-red-100 text-red-800",
        }
        return (
          <div className={`capitalize px-2 py-1 rounded-full text-xs font-semibold w-fit ${colors[status] || "bg-gray-100 text-gray-800"}`}>{status}</div>
        )
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "paidBy",
      header: "Paid By",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("paidBy")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditDialog(order)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(order.id)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
  })

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Order
        </Button>
      </div>
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-4 bg-muted/50">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Order Items</h4>
                          <div className="grid gap-2">
                            {row.original.orderItems.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-background p-2 rounded-md border text-sm">
                                <div className="flex items-center gap-2">
                                  {item.itemImg && (
                                    <img src={item.itemImg} alt={item.itemName} className="h-8 w-8 rounded object-cover" />
                                  )}
                                  <span>{item.itemName}</span>
                                </div>
                                <div className="flex gap-4 text-muted-foreground">
                                  <span>Qty: {item.itemQuantity}</span>
                                  <span>Price: ₹{item.itemPrice}</span>
                                  <span className="font-medium text-foreground">Total: ₹{item.itemQuantity * item.itemPrice}</span>
                                </div>
                              </div>
                            ))}
                            {(!row.original.orderItems || row.original.orderItems.length === 0) && (
                              <p className="text-sm text-muted-foreground">No items found.</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Order" : "Add Order"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Make changes to the order here." : "Add a new order to the system."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={currentOrder.name || ""}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={currentOrder.amount || ""}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, amount: Number(e.target.value) })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={currentOrder.phoneNumber || ""}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, phoneNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={currentOrder.address || ""}
                  onChange={(e) => setCurrentOrder({ ...currentOrder, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select 
                  value={currentOrder.status} 
                  onValueChange={(val: any) => setCurrentOrder({ ...currentOrder, status: val })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="delivering">Delivering</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paidBy" className="text-right">
                  Paid By
                </Label>
                <Select 
                  value={currentOrder.paidBy} 
                  onValueChange={(val: any) => setCurrentOrder({ ...currentOrder, paidBy: val })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">Order Items</h4>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>
                <div className="grid gap-4 max-h-[300px] overflow-y-auto pr-2">
                  {currentOrder.orderItems && currentOrder.orderItems.length > 0 ? (
                    currentOrder.orderItems.map((item, index) => (
                      <div key={index} className="flex flex-col space-y-2 rounded-md border p-3">
                        <div className="flex items-center gap-2">
                           <Input 
                              placeholder="Image URL" 
                              value={item.itemImg || ""} 
                              onChange={(e) => handleItemChange(index, 'itemImg', e.target.value)}
                              className="w-1/3"
                           />
                           <Input 
                              placeholder="Item Name" 
                              value={item.itemName} 
                              onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                              className="flex-1"
                           />
                           <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="grid grid-cols-2 gap-2 flex-1">
                             <div>
                               <Label className="text-xs">Price</Label>
                               <Input 
                                  type="number" 
                                  placeholder="Price" 
                                  value={item.itemPrice} 
                                  onChange={(e) => handleItemChange(index, 'itemPrice', Number(e.target.value))}
                               />
                             </div>
                             <div>
                               <Label className="text-xs">Qty</Label>
                               <Input 
                                  type="number" 
                                  placeholder="Qty" 
                                  value={item.itemQuantity} 
                                  onChange={(e) => handleItemChange(index, 'itemQuantity', Number(e.target.value))}
                               />
                             </div>
                           </div>
                           <div className="flex items-end pb-2">
                              <span className="text-sm font-medium">₹{item.itemQuantity * item.itemPrice}</span>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No items in this order.
                    </div>
                  )}
                </div>
              </div>

            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}