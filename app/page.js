import Cards from '@/components/Cards';
import Header from '@/components/Header';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";



export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  const dsquared2Apps = [
    {
      emoji: '🧇',
      title: 'Preorder XML Generator',
      tooltip: 'Generate XML for preorder',
      link: '/PreorderExcelToXml'
    },
    {
      emoji: '🔫',
      title: 'Product information Generator',
      tooltip: 'Generate XML for preorder',
      link: '/Bullet'
    },
    {
      emoji: '✍🏽',
      title: 'Recommendation XML Generator',
      tooltip: 'Generate XML for recommendation',
      link: '/Recommendation'
    },
    {
      emoji: '📸',
      title: 'Assign Medium View Type XML Generator',
      tooltip: 'Assign Medium View Type XML Generator',
      link: '/AssignMediumViewType'
    },
    {
      emoji: '📌',
      title: 'Categorisation XML Generator',
      tooltip: 'Generate XML for categorisation',
      link: '/Categorisation'
    },
    {
      emoji: '📹',
      title: 'Vimeo Video Generator',
      tooltip: 'Generate XML for Vimeo video version V1 - V2',
      link: '/VideoVimeo'
    },
    // {
    //   emoji: '💰',
    //   title: 'Ecommerce Data & Table',
    //   tooltip: 'We can view a several information for our eCommerce',
    //   link: '/EcomTab'
    // },
    {
      emoji: '🤡',
      title: 'Import PIM Data From Akeneo',
      tooltip: 'Launch the job for the PIM Update',
      link: '/PimData'
    },
    {
      emoji: '🧹',
      title: 'Clean special character from XLSX',
      tooltip: 'Clean from special character',
      link: '/CleanCharacter'
    },
    {
      emoji: '➗',
      title: 'Divide Bullet Point for Akeneo',
      tooltip: 'Divide Bullet Point for Akeneo',
      link: '/DividedBullet'
    },


  ];
  return (
    <>
      <header>
        <Header isDsquared2={user} />
      </header>
      {
        <main className=' flex flex-row flex-wrap justify-center max-w-[90vw] m-auto'>
          {user ? (
            dsquared2Apps.map((app, index) => (
              <Cards key={index} emoji={app.emoji} title={app.title} tooltip={app.tooltip} link={app.link} isDsquared2={user} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 " />
            ))
          ) : (
            <div className="flex justify-center items-center w-100 h-[90vh] flex-col gap-y-5">
              <LoginLink>
                <button className="p-[25px] px-[120px] bg-[#fafc52] rounded-[25px] text-black uppercase font-extrabold">
                  Sign In
                </button>
              </LoginLink>
            </div>
          )
          }
        </main>
      }

    </>
  )
}
