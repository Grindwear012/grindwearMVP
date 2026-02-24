import { cn } from '@/lib/utils';

export function Logo({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label="GRINDWEAR STUDIOS"
      className={cn('w-auto', className)}
      viewBox="0 0 140 40"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M20,8 L20,32 L26,32 L26,18 L34,18 L34,32 L40,32 L40,8 L20,8 Z M8,8 L14,8 L14,32 L8,32 L8,8 Z M46,8 L52,8 L52,26 C52,29.3137085 49.3137085,32 46,32 L46,8 Z M62,8 L56,8 L56,32 L62,32 C65.3137085,32 68,29.3137085 68,26 L68,8 L62,8 Z M74,8 L80,8 L80,32 L74,32 L74,8 Z M86,8 L92,8 L92,32 L86,32 L86,8 Z M102,8 L96,8 L96,32 L102,32 C105.313708,32 108,29.3137085 108,26 C108,22.6862915 105.313708,20 102,20 L102,8 Z M114,8 L120,8 L120,14 L126,14 L126,8 L132,8 L132,32 L126,32 L126,20 L120,20 L120,32 L114,32 L114,8 Z" />
    </svg>
  );
}
