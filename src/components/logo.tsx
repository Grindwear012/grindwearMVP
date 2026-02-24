
import { cn } from '@/lib/utils';

export function Logo({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('inline-block', className)}>
      <svg
        role="img"
        aria-label="Thrift Clothing Plug Logo"
        className="h-full w-auto"
        viewBox="0 0 88 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Thrift Clothing Plug Logo</title>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M28.423 23.108V5.777C28.423 2.586 30.92 0 34.004 0C37.088 0 39.585 2.586 39.585 5.777V23.108H28.423ZM57.577 23.108V5.777C57.577 2.586 55.08 0 52 0C48.916 0 46.419 2.586 46.419 5.777V23.108H57.577ZM88 43.34C88 66.075 68.301 84.483 44 84.483C19.699 84.483 0 66.075 0 43.34V25.99H88V43.34ZM49.715 110H38.285V87.365H49.715V110Z"
          fill="currentColor"
        />
        <path
          d="M33.722 42.133V34.505H46.853V42.133H41.605V59.462H33.722V42.133Z"
          fill="white"
        />
        <path
          d="M58.97 43.76C58.97 38.38 62.77 34.506 67.99 34.506H71.59V59.462H66.6V54.432H64.09V59.462H59.14V34.506H67.99C72.84 34.506 76.51 38.436 76.51 44.116C76.51 48.076 74.07 51.136 70.33 52.186L76.84 59.462H71.14L64.99 51.972H64.09V47.112H67.99C70.02 47.112 71.59 45.706 71.59 44.116C71.59 42.526 70.02 41.116 67.99 41.116H64.09V43.762L58.97 43.76Z"
          fill="white"
        />
        <path
          d="M48.243 59.462H52.105C57.487 59.462 59.605 56.096 59.605 51.492C59.605 46.887 57.487 43.522 52.105 43.522H45.72V47.582H51.415C54.043 47.582 54.805 49.332 54.805 51.492C54.805 53.652 54.043 55.402 51.415 55.402H45.72V59.462H48.243Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
