import AuthButton from '@/components/AuthButton';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center h-screen text-center py-20 px-5">
          <h1 className="text-5xl font-bold mb-5">Memento Mori</h1>
          <p className="max-w-2xl text-lg mb-8 text-foreground">
            Track your life week by week, reflect on your journey, and visualize
            how much time you have left. Embrace each moment with intention.
          </p>
          <div>
            <AuthButton className="border-none" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How Much Time Do You Have Left?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center bg-backgroundSecondary text-accent p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                <h3 className="text-4xl font-semibold mb-2">75 Years</h3>
                <p className="text-foreground text-center">
                  The average life expectancy is 75 years. How will you spend
                  yours?
                </p>
              </div>
              <div className="flex flex-col items-center bg-backgroundSecondary text-accent p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                <h3 className="text-4xl font-semibold mb-2">3900 Weeks</h3>
                <p className="text-foreground text-center">
                  That’s 3,900 weeks of life. Track each one and make it count.
                </p>
              </div>
              <div className="flex flex-col items-center bg-backgroundSecondary text-accent p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                <h3 className="text-4xl font-semibold mb-2">
                  Live Intentionally
                </h3>
                <p className="text-foreground text-center">
                  Reflect on every week of your life and create meaningful
                  moments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Posts Section */}
        <section className="py-20 px-5">
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-8">
              Create a Post for Each Week of Your Life
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-12">
              For each week, you can create a post to reflect on your
              experiences, set goals, and capture memories. Each post becomes a
              part of your timeline, reminding you to live fully in the present.
            </p>
            <AuthButton className="border-none" />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-background text-foreground text-center">
          <p className="text-sm">© 2024 Memento Mori. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
