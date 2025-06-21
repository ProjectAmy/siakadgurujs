import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
  {/* Logo Section */}
  <div className="flex-1 flex justify-center md:justify-end items-center">
    <Image
      src="/images/logo.png"
      alt="Logo Al Irsyad"
      width={320}
      height={320}
      className="w-64 h-64 object-contain"
      priority
    />
  </div>
  {/* Login Form Section */}
  <div className="flex-1 flex flex-col justify-center items-center h-full min-h-[450px] px-6 md:px-16">
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl mb-8 text-center text-gray-800 w-full">Guru dan Karyawan</h1>
      <form className="w-full max-w-sm flex flex-col gap-4 items-center">
        <div className="w-full">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" d="M3 7.5l9 6 9-6M4.5 19.5h15a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 19.5 4.5h-15A1.5 1.5 0 0 0 3 6v12a1.5 1.5 0 0 0 1.5 1.5z"/></svg>
            </span>
            <input
              type="email"
              id="email"
              required
              placeholder="Masukan email anda"
              className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600"
            />
          </div>
        </div>
        <div className="w-full">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-7V7A6 6 0 0 0 6 7v3a6 6 0 0 0 12 0z"/></svg>
            </span>
            <input
              type="password"
              id="password"
              required
              placeholder="Masukan password anda"
              className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600"
            />
          </div>
        </div>
        <div className="flex flex-row w-full gap-3 mt-4">
  <button
    type="submit"
    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded py-2 transition-colors"
  >
    Masuk
  </button>
  <button
    type="button"
    className="flex items-center justify-center border border-gray-300 bg-white text-gray-700 font-medium rounded py-2 transition-colors hover:bg-gray-50 active:bg-gray-100"
    style={{ width: 48, height: 40 }}
    aria-label="Login dengan Google"
  >
    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_17_40)">
        <path d="M47.5 24.5C47.5 23.1 47.4 21.8 47.2 20.5H24V28.1H37.2C36.6 31.2 34.6 33.7 31.8 35.5V40.1H39.2C43.3 36.3 45.5 31 45.5 24.5Z" fill="#4285F4"/>
        <path d="M24 48C30.4 48 35.9 46 39.2 40.1L31.8 35.5C29.9 36.7 27.6 37.4 24 37.4C18.9 37.4 14.5 33.8 13.1 29.1H5.5V33.9C8.9 41.1 15.9 48 24 48Z" fill="#34A853"/>
        <path d="M13.1 29.1C12.7 27.9 12.5 26.7 12.5 25.5C12.5 24.3 12.7 23.1 13.1 21.9V17.1H5.5C3.9 20.1 3 23.4 3 26.9C3 30.4 3.9 33.7 5.5 36.7L13.1 29.1Z" fill="#FBBC05"/>
        <path d="M24 13.6C27.1 13.6 29.5 14.7 31.2 16.3L39.3 8.2C35.9 5.1 30.4 2.9 24 2.9C15.9 2.9 8.9 9.8 5.5 17.1L13.1 21.9C14.5 17.2 18.9 13.6 24 13.6Z" fill="#EA4335"/>
      </g>
      <defs>
        <clipPath id="clip0_17_40">
          <rect width="48" height="48" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  </button>
</div>
      </form>
    </div>
  </div>
      </div>
    </div>
  );
}
