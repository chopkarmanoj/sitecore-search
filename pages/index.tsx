import { Geist, Geist_Mono } from "next/font/google";
import PreviewSearch from "../widgets/PreviewSearchBasic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex flex-col items-center justify-center min-h-screen p-6 sm:p-12 bg-gradient-to-br from-gray-50 to-gray-100`}
    >
      {/* Search Box */}
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <PreviewSearch rfkId="rfkid_6" />
      </div>

      {/* Heading */}
      <h1 className="mt-10 text-4xl font-bold text-gray-800 tracking-tight">
        Welcome to the Demo
      </h1>
      <p className="mt-3 text-lg text-gray-600 text-center max-w-xl">
        Use the search above to explore Sitecore Search features.
      </p>
    </div>
  );
}
