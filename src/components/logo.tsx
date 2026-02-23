import { cn } from '@/lib/utils';

const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    aria-label="Thrift Clothing Plug Icon"
    className={cn('h-6 w-auto', className)}
    viewBox="0 0 151 165"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M51.6286 39.5V8.5C51.6286 3.80558 55.4342 0 60.1286 0H71.3714V39.5H51.6286Z" />
    <path d="M119.829 0V39.5H140.114V8.5C140.114 3.80558 136.309 0 131.614 0H119.829Z" />
    <path d="M79.8691 106V144C79.8691 148.694 83.6747 152.5 88.3691 152.5C93.0636 152.5 96.8691 148.694 96.8691 144V106H79.8691Z" />
    <path d="M0 106V58C0 44.1929 11.1929 33 25 33H126C139.807 33 151 44.1929 151 58V106H0Z" />
    <path
      d="M87.9714 58.5C95.5398 58.5 101.714 64.6744 101.714 72.2429V76.5H69.2V58.5H87.9714ZM82.7143 95.5H99.6286C107.197 95.5 113.371 89.3256 113.371 81.7571V71.2143C113.371 58.4114 102.666 47.7143 89.8571 47.7143H69.2V95.5H82.7143ZM97.7143 84C97.7143 86.6944 95.4086 89 92.7143 89H82.7143V82.0714H91.8571C95.0571 82.0714 97.7143 81.4286 97.7143 84Z"
      fill="white"
    />
  </svg>
);

export function Logo({
  showText = true,
  textClasses,
}: {
  showText?: boolean;
  textClasses?: string;
}) {
  return (
    <>
      <LogoIcon />
      {showText && <span className={cn('font-bold', textClasses)}>THRIFT CLOTHING PLUG</span>}
    </>
  );
}
