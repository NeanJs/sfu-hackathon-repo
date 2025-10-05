"use client";

export default function HelpCenter() {
  return (
    <div className="card-elevated p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-black">
        Help & Support
      </h2>
      <p className="text-lg text-muted-foreground text-center">
        Need assistance? We're here to help.
      </p>
      <div className="text-center space-y-2">
        <p className="text-lg">
          📞 <strong>Phone:</strong> +1 (888) 555-0199
        </p>
        <p className="text-lg">
          📧 <strong>Email:</strong>{" "}
          <a
            href="mailto:support@leadger.tech"
            className="text-orange-500 hover:underline"
          >
            support@leadger.tech
          </a>
        </p>
        <p className="text-lg">
          🕒 <strong>Hours:</strong> Monday–Friday, 9am–6pm PT
        </p>
      </div>
      <p className="text-center text-muted-foreground mt-4">
        For technical issues, feedback, or general inquiries, feel free to reach
        out. We’ll get back to you as soon as possible.
      </p>
    </div>
  );
}
