"use client"
import Cards from '@/components/Cards';
import Header from '@/components/Header';



export default function Home() {

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
    }

  ];
  return (
      <>
        <header>
          <Header />
        </header>
        <main className=' flex flex-row flex-wrap justify-center max-w-[90vw] m-auto'>
          {
            dsquared2Apps.map((app, index) => (
              <Cards key={index} emoji={app.emoji} title={app.title} tooltip={app.tooltip} link={app.link} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 " />
            ))
          }
        </main>
      </>
  )
}
