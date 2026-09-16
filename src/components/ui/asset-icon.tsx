import Image from "next/image";

export function AssetIcon({
  src,
  className = "",
  size = 32,
}: {
  src: string;
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      unoptimized
    />
  );
}
