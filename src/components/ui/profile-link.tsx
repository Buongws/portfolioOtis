import type { ReactNode } from "react";

export function ProfileLink({
  href,
  children,
  label,
  primary = false,
  download = false,
}: {
  href: string | null;
  children: ReactNode;
  label: string;
  primary?: boolean;
  download?: boolean;
}) {
  const className = `profile-link ${primary ? "profile-link-primary" : "profile-link-social"}`;
  if (!href) {
    return (
      <button
        type="button"
        className={className}
        disabled
        title={`${label}: link not provided yet`}
        aria-label={`${label} (not available yet)`}
      >
        {children}
      </button>
    );
  }
  return (
    <a
      className={className}
      href={href}
      aria-label={label}
      download={download || undefined}
      target={download ? undefined : "_blank"}
      rel={download ? undefined : "noopener noreferrer"}
    >
      {children}
    </a>
  );
}
