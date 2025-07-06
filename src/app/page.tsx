import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-900 text-white">
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl animate-gradient-xy"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent md:text-7xl bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
          Weather at Your Fingertips
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          Experience real-time weather forecasts with a touch of magic. Fast, accurate, and beautifully designed.
        </p>
        <Link href="/dashboard"
          className="mt-8 rounded-full bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition duration-300 ease-in-out hover:bg-white/20">
            Get Started
        </Link>
      </div>
    </div>
  );
}