"use client";

export default function Testimonials() {
  return (
    <div className="card-elevated p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center text-black">
        What People Are Saying
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <p className="text-lg italic text-muted-foreground">
            “Leadger helped me finally shop and invest with complete confidence
            in my values.”
          </p>
          <p className="mt-4 text-right font-semibold text-orange-500">
            – Sarah M.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <p className="text-lg italic text-muted-foreground">
            “The app’s insights are clear, trustworthy, and made my choices so
            much easier.”
          </p>
          <p className="mt-4 text-right font-semibold text-orange-500">
            – Daniel T.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <p className="text-lg italic text-muted-foreground">
            “I love how Leadger provides real action steps that match my budget
            and ethics.”
          </p>
          <p className="mt-4 text-right font-semibold text-orange-500">
            – Gloria P.
          </p>
        </div>
      </div>
    </div>
  );
}
