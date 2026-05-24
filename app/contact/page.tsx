"use client";

import { useState, useRef, useEffect } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formValid, setFormValid] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const loadTime = useRef(Date.now());

  function checkValidity() {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();
    setFormValid(Boolean(name && email && message));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formValid) return;
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      honeypot: formData.get("_hp"),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timeOnPage: Math.round((Date.now() - loadTime.current) / 1000),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="contact-page flex flex-1 flex-col items-center justify-center py-macro">
      <div className="w-full max-w-2xl mx-auto relative overflow-visible">
        {/* Centered halo behind form card */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-ethos-blue/10 pointer-events-none z-0"
          aria-hidden="true"
        />
        {/* Header */}
        <div className="mb-24 text-center">
          <h1 className="page-title">Contact</h1>
          <div className="h-px w-16 bg-ethos-blue mx-auto mt-6 mb-6" />
          <p className="font-serif text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            I&rsquo;m always interested in conversations about design, AI, and
            building products that matter.
          </p>
        </div>

        {/* Form Container */}
        {status === "success" ? (
          <div className="bg-[#f9f7f3] p-8 min-[768px]:p-16 relative">
            <div className="border-l-4 border-ethos-blue pl-6 py-4">
              <p className="font-serif text-[18px] text-gray-800">
                Message sent. I&rsquo;ll be in touch.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#f9f7f3] p-8 min-[768px]:p-16 relative overflow-hidden group">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-ethos-blue/20 -mr-4 -mt-4 transition-transform duration-700 group-hover:translate-x-2 group-hover:-translate-y-2" />

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-12"
              onChange={checkValidity}
            >
              {/* Honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
              </div>

              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-0 border-b border-gray-300 py-4 px-0 font-serif text-lg text-gray-900 placeholder-transparent focus:ring-0 focus:border-ethos-blue transition-colors rounded-none"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 top-4 font-sans uppercase tracking-[0.15em] text-[11px] text-gray-400 transition-all peer-focus:-translate-y-6 peer-focus:text-[11px] peer-focus:text-ethos-blue peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-ethos-blue pointer-events-none"
                >
                  Name / Required
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-0 border-b border-gray-300 py-4 px-0 font-serif text-lg text-gray-900 placeholder-transparent focus:ring-0 focus:border-ethos-blue transition-colors rounded-none"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-4 font-sans uppercase tracking-[0.15em] text-[11px] text-gray-400 transition-all peer-focus:-translate-y-6 peer-focus:text-[11px] peer-focus:text-ethos-blue peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-ethos-blue pointer-events-none"
                >
                  Email / Required
                </label>
              </div>

              {/* Message */}
              <div className="relative pt-4">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder=" "
                  className="peer w-full bg-transparent border-0 border-b border-gray-300 py-4 px-0 font-serif text-lg text-gray-900 placeholder-transparent focus:ring-0 focus:border-ethos-blue transition-colors rounded-none resize-none"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 top-8 font-sans uppercase tracking-[0.15em] text-[11px] text-gray-400 transition-all peer-focus:-translate-y-8 peer-focus:text-[11px] peer-focus:text-ethos-blue peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:text-ethos-blue pointer-events-none"
                >
                  Message / Required
                </label>
              </div>

              {status === "error" && (
                <p className="font-sans text-[13px] text-red-600">{errorMsg}</p>
              )}

              {/* Submit */}
              <div className="pt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={!formValid || status === "sending"}
                  className={`btn-back font-sans uppercase tracking-[0.15em] text-[11px] py-4 px-12 rounded-none transition-all duration-300 border border-transparent ${
                    formValid && status !== "sending"
                      ? "bg-ethos-blue text-white hover:bg-ethos-blue/90 shadow-[0_20px_40px_rgba(19,19,236,0.15)]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {status === "sending" ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="mt-16 flex justify-between items-center border-t border-ethos-blue/10 pt-6">
          <span className="font-sans uppercase tracking-[0.15em] text-[10px] text-gray-500">
            Secure Channel
          </span>
          <span className="font-sans uppercase tracking-[0.15em] text-[10px] text-gray-500">
            Lisa Aufox / Portfolio
          </span>
        </div>
      </div>
    </div>
  );
}
