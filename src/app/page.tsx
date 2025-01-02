import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200 font-sans flex items-center justify-center">
      {/* Main Container */}
      <div className="flex flex-col sm:flex-row items-center justify-center max-w-6xl mx-auto px-6 sm:px-16 py-12 sm:py-20">
        {/* Left Section */}
        <div className="flex flex-col gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            TeachTech
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
            Assistente AI intelligente per valutare le tue risposte scritte a
            mano.
            <br />
            <span className="italic">{`Supporta l'inglese e l'italiano.`}</span>
          </p>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-6">
            {/* Evaluate Now Button */}
            <a
              href="/evaluate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm sm:text-base shadow-md hover:bg-blue-700 transition-all"
              aria-label="Evaluate now"
            >
              Valuta domanda
            </a>
            {/* Valuta Ora Button */}
            <a
              href="/evaluate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Valuta ora"
            >
              Valuta ora
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="mt-8 md:mt-12 sm:mt-0 sm:ml-8 w-full sm:w-1/2 max-w-md">
          <Image
            src="/apphero.jpg"
            alt="Image needs to be uploaded."
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
