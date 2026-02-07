import {
  CalendarX2Icon,
  FacebookIcon,
  InstagramIcon,
  LanguagesIcon,
  LinkedinIcon,
  TriangleAlertIcon,
  TruckIcon,
  TwitterIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator
// } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  SidebarTrigger
} from '@/components/ui/sidebar'

import ProductInsightsCard from '@/components/shadcn-studio/blocks/widget-product-insights'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'
import SalesMetricsCard from '@/components/shadcn-studio/blocks/chart-sales-metrics'
import StatisticsCard from '@/components/shadcn-studio/blocks/statistics-card-01'
import TotalEarningCard from '@/components/shadcn-studio/blocks/widget-total-earning'
import TransactionDatatable, { type Item } from '@/components/shadcn-studio/blocks/datatable-transaction'

import earningData from '@/constants/earningData'
import transactionData from '@/constants/transactionData'

// Statistics card data
const StatisticsCardData = [
  {
    icon: <TruckIcon className='size-4' />,
    value: '42',
    title: 'Shipped Orders',
    changePercentage: '+18.2%'
  },
  {
    icon: <TriangleAlertIcon className='size-4' />,
    value: '8',
    title: 'Damaged Returns',
    changePercentage: '-8.7%'
  },
  {
    icon: <CalendarX2Icon className='size-4' />,
    value: '27',
    title: 'Missed Delivery Slots',
    changePercentage: '+4.3%'
  }
]

const Dashboard = () => {
  return (
    <div className='flex min-h-dvh w-full'>

      <div className='flex flex-1 flex-col'>
        <header className='bg-card sticky top-0 z-50 border-b'>
          <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6'>
            <div className='flex items-center gap-4'>
              <SidebarTrigger className='[&_svg]:!size-5' />
              <Separator orientation='vertical' className='hidden !h-4 sm:block' />
              {/* <Breadcrumb className='hidden sm:block'>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Free</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>
            <div className='flex items-center gap-1.5'>
              <ProfileDropdown
                trigger={
                  <Button variant='ghost' size='icon' className='size-9.5'>
                    <Avatar className='size-9.5 rounded-md'>
                      <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
            </div>
          </div>
        </header>
        <main className='mx-auto size-full max-w-7xl flex-1 px-4 py-6 sm:px-6'>
          <div className='grid grid-cols-2 gap-6 lg:grid-cols-3'>
            {/* Statistics Cards */}
            <div className='col-span-full grid gap-6 sm:grid-cols-3 md:max-lg:grid-cols-1'>
              {StatisticsCardData.map((card, index) => (
                <StatisticsCard
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  value={card.value}
                  changePercentage={card.changePercentage}
                />
              ))}
            </div>

            <div className='grid gap-6 max-xl:col-span-full lg:max-xl:grid-cols-2'>
              {/* Product Insights Card */}
              <ProductInsightsCard className='justify-between gap-3 [&>[data-slot=card-content]]:space-y-5' />

              {/* Total Earning Card */}
              <TotalEarningCard
                title='Total Earning'
                earning={24650}
                trend='up'
                percentage={10}
                comparisonText='Compare to last year ($84,325)'
                earningData={earningData}
                className='justify-between gap-5 sm:min-w-0 [&>[data-slot=card-content]]:space-y-7'
              />
            </div>

            <SalesMetricsCard className='col-span-full xl:col-span-2 [&>[data-slot=card-content]]:space-y-6' />

            <Card className='col-span-full w-full py-0'>
              <TransactionDatatable data={transactionData} />
            </Card>
          </div>
        </main>
        {/* <footer>
          <div className='text-muted-foreground mx-auto flex size-full max-w-7xl items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6'>
            <p className='text-sm text-balance max-sm:text-center'>
              {`©${new Date().getFullYear()}`}{' '}
              <a href='#' className='text-primary'>
                shadcn/studio
              </a>
              , Made for better web design
            </p>
            <div className='flex items-center gap-5'>
              <a href='#'>
                <FacebookIcon className='size-4' />
              </a>
              <a href='#'>
                <InstagramIcon className='size-4' />
              </a>
              <a href='#'>
                <LinkedinIcon className='size-4' />
              </a>
              <a href='#'>
                <TwitterIcon className='size-4' />
              </a>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  )
}

export default Dashboard