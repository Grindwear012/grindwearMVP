import { cn } from '@/lib/utils';

export function Logo({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label="Thrift Clothing Plug Logo"
      className={cn('w-auto', className)}
      viewBox="0 0 200 72"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0, 0)">
        <g fill="currentColor">
          <path d="M18 14V2C18 0.895431 18.8954 0 20 0H26C27.1046 0 28 0.895431 28 2V14H18Z" />
          <path d="M36 14V2C36 0.895431 36.8954 0 38 0H44C45.1046 0 46 0.895431 46 2V14H36Z" />
          <path d="M28 56V70C28 71.1046 28.8954 72 30 72H34C35.1046 72 36 71.1046 36 70V56H28Z" />
          <path d="M4 18H60V42C60 53.0457 51.0457 62 40 62H24C12.9543 62 4 53.0457 4 42V18Z" />
          <text x="32" y="41" fontFamily="sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="central">TCP</text>
        </g>
      </g>
      <text x="132" y="36" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle" dominantBaseline="central">THRIFT CLOTHING PLUG</text>
    </svg>
  );
}
