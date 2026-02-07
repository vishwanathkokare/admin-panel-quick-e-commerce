import OrdersDatatable from "@/components/datatable-orders"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const Orders = async () => {
  const ordersResponse =  await fetch('http://127.0.0.1:3000/api/orders',{
    method: 'GET'
  })
  const ordersData = await ordersResponse.json();

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