import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({
  className,
}: {
  className?: string;
}) {
  return (
    <Image
      src="https://res.cloudinary.com/dxz2bkns2/image/upload/v1771904484/logo_pic_fpmo4w.jpg"
      alt="Thrift Clothing Plug Logo"
      width={88}
      height={110}
      className={cn('h-full w-auto', className)}
    />
  );
}
