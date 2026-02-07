import OrdersDatatable from "@/components/datatable-orders"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import ordersData from "@/app/api/orders/db"

const Orders = () => {
  return (
    <div className="p-5 w-full">
     <div className="flex items-center gap-4 mb-8">
       <SidebarTrigger className='[&_svg]:!size-5' />
      <Separator orientation='vertical' className='hidden !h-4 sm:block' />
     </div>
      <Card className="w-full py-0">
        <OrdersDatatable data={ordersData} />
      </Card>
    </div>
  )
}

export default Orders 