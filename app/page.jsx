import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="flex h-screen bg-black">
        <div className="w-2/3 flex items-center justify-center">
          <img
            src="img.webp"
            alt="log"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="w-1/3 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Link
            href='sign-in'
            className='text-gray-300 hover:text-white text-2xl'
          >
            Start
          </Link>
        </div>
      </section>
    </>
  );
}
