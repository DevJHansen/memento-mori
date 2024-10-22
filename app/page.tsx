/* eslint-disable @next/next/no-img-element */
import AuthButton from '@/components/AuthButton';
import Navbar from '@/components/Navbar';
import hero from '@/public/hero.png';
import grid from '@/public/grid.png';
import create from '@/public/create.png';
import gallery from '@/public/gallery.png';
import { LottiePlayer } from '@/components/LazyLottie';
import journalAnimation from '@/public/journal.json';
import feedAnimation from '@/public/feed.json';
import timelineAnimation from '@/public/timeline.json';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-between bg-background text-foreground">
        <section className="flex flex-col items-center justify-center text-center pt-20 px-5 gap-4 md:gap-8">
          <h1 className="text-5xl font-bold">Memento Mori Calendar</h1>
          <p className="max-w-2xl text-lg text-foreground">
            Unveil your life&apos;s journey on an interactive 80-year timeline.
            Add personal memories to each week, reflect on where you&apos;ve
            been, and embrace intentional living every day.
          </p>
          <AuthButton className="border-none text-foreground" />
          <img alt="hero-image" src={hero.src} />
        </section>

        <section className="md:py-48 py-10 px-4 md:px-20 text-center">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="flex flex-col justify-center items-center gap-4">
              <LottiePlayer
                data={timelineAnimation}
                style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
              />
              <h1 className="text-5xl font-bold">Interactive Life Timeline</h1>
              <p className="max-w-2xl text-lg text-foreground">
                Visualize your entire life, week by week, on an 75-year timeline
                to gain a profound perspective on time.
              </p>
            </div>
            <div>
              <img alt="grid-image" src={grid.src} />
            </div>
          </div>
        </section>

        <section className="md:py-48 py-10 px-4 md:px-20 text-center">
          <div className="flex flex-col-reverse md:flex-row items-center justify-around gap-8">
            <div>
              <img alt="create-image" src={create.src} />
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <LottiePlayer
                data={journalAnimation}
                style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
              />
              <h1 className="text-5xl font-bold">Personal Memory Journal</h1>
              <p className="max-w-2xl text-lg text-foreground">
                Add photos, notes, and emotions to each week, creating a rich
                tapestry of your life&apos;s experiences.
              </p>
            </div>
          </div>
        </section>

        <section className="md:py-48 py-10 px-4 md:px-20 text-center">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="flex flex-col justify-center items-center gap-4">
              <LottiePlayer
                data={feedAnimation}
                style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
              />
              <h1 className="text-5xl font-bold">Mementos Feed</h1>
              <p className="max-w-2xl text-lg text-foreground">
                Browse a personalized feed of all your added mementos, allowing
                you to reflect on your life&apos;s journey and revisit cherished
                memories anytime.
              </p>
            </div>
            <div>
              <img alt="gallery-image" src={gallery.src} />
            </div>
          </div>
        </section>

        <section className="md:py-48 py-10 px-4 md:px-20 text-center">
          <div className="text-center flex flex-col items-center">
            <h1 className="text-5xl font-bold mb-4">
              Embark on a Journey of Self-Discovery
            </h1>
            <p className="text-lg text-foreground">
              Join thousands who are living more intentionally and making every
              week count.
            </p>
            <AuthButton className="border-none text-foreground mt-8" />
          </div>
        </section>
      </div>
    </div>
  );
}
