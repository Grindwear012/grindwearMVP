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
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <title>Thrift Clothing Plug Logo</title>
        <g className="text-black" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.416 0H26.664V12.192H20.416V0ZM37.336 0H43.584V12.192H37.336V0ZM16 14.224C16 13.0006 16.9723 12 18.16 12H45.84C47.0277 12 48 13.0006 48 14.224V28.096C48 37.1593 40.8531 44.48 32 44.48C23.1469 44.48 16 37.1593 16 28.096V14.224ZM29.216 44.608H34.784V48H29.216V44.608Z"
            fill="currentColor"
          />
          <path
            d="M23.184 21.6V17.024H32.656V21.6H28.864V32H23.184V21.6Z"
            fill="white"
          />
          <path
            d="M36.1789 32H38.5469C41.8789 32 43.1229 29.728 43.1229 26.8C43.1229 23.872 41.8789 21.6 38.5469 21.6H33.5229V24.4H38.1629C39.4069 24.4 39.8989 25.408 39.8989 26.8C39.8989 28.192 39.4069 29.2 38.1629 29.2H33.5229V32H36.1789Z"
            fill="white"
          />
          <path
            d="M40.334 26.04C40.334 23.368 42.158 21.6 44.806 21.6H47.198V32H44.134V28.84H42.75V32H39.686V17H44.806C47.454 17 50.254 18.808 50.254 22.8C50.254 25.592 48.646 27.64 46.23 28.24L50.446 32H46.846L43.03 28.144H42.75V25.2H44.806C45.99 25.2 47.182 24.424 47.182 22.8C47.182 21.176 45.99 20.4 44.806 20.4H42.75V26.04H40.334Z"
            fill="white"
          />
        </g>
        <text
          x="32"
          y="60"
          fontFamily="sans-serif"
          fontSize="5.5"
          fontWeight="bold"
          letterSpacing="0.05em"
          textAnchor="middle"
          fill="currentColor"
          className="text-black"
        >
          THRIFT CLOTHING PLUG
        </text>
      </svg>
    </div>
  );
}
