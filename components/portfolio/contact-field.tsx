type ContactFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  multiline?: boolean;
  rows?: number;
};

const inputClassName =
  "peer w-full bg-transparent border-0 border-b border-gray-300 px-0 pt-8 pb-3 font-serif text-lg text-gray-900 placeholder-transparent outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-ethos-blue transition-colors rounded-none";

const labelClassName =
  "pointer-events-none absolute left-0 top-8 font-sans uppercase tracking-[0.15em] text-[11px] text-gray-400 transition-all duration-200 peer-focus:top-0 peer-focus:text-ethos-blue peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-ethos-blue";

export function ContactField({
  id,
  label,
  type = "text",
  multiline = false,
  rows = 4,
}: ContactFieldProps) {
  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          name={id}
          required
          rows={rows}
          placeholder=" "
          className={`${inputClassName} resize-none`}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          required
          placeholder=" "
          className={inputClassName}
        />
      )}
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
    </div>
  );
}
