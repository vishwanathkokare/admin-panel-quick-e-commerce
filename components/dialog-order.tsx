import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type OrderItem = {
  id: string
  productName: string
  quantity: number
  price: number
}

export type OrderItems = OrderItem[]

type DialogOrderProps = {
  Id: string
  Name: string
  Amount: number
  Address: string
  Status: string
  OrderItems: OrderItems
  PhoneNumber: string
  PaidBy: string
}

const DialogOrder = ({
  Id,
  Name,
  Amount,
  Address,
  PhoneNumber,
  Status,
  OrderItems,
  PaidBy
}: DialogOrderProps) => {

  const [open, setOpen] = useState(false)

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const payload = {
      name: formData.get("name"),
      address: formData.get("address"),
      amount: Number(formData.get("amount")),
      phoneNumber: formData.get("phonenumber"),
      paidBy: formData.get("paidby"),
      status: formData.get("status"),
      orderItems: OrderItems
    }

    await fetch(`http://127.0.0.1:3000/api/orders?id=${Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="p-1 pl-2 cursor-pointer hover:bg-slate-200 rounded w-full block">
          Edit
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={submitForm}>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Make changes to your order here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input name="name" defaultValue={Name} />
            </Field>

            <Field>
              <Label>Address</Label>
              <Input name="address" defaultValue={Address} />
            </Field>

            <Field>
              <Label>Amount</Label>
              <Input name="amount" defaultValue={Amount} />
            </Field>

            <Field>
              <Label>Phone Number</Label>
              <Input name="phonenumber" defaultValue={PhoneNumber} />
            </Field>

            <Field>
              <Label>Status</Label>
              <Select name="status" defaultValue={Status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="delivering">Delivering</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label>Paid By</Label>
              <Select name="paidby" defaultValue={PaidBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-8">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogOrder