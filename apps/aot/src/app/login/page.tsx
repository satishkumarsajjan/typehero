import Link from 'next/link';
import { LoginButton } from './_components/LoginButton';
import { buildMetaForEventPage } from '~/utils/metadata';

export function generateMetadata() {
  return buildMetaForEventPage();
}
export default function Index({
  searchParams,
}: {
  searchParams: {
    redirectTo: string | null;
  };
}) {
  return (
    <div className="container -mt-[56px] flex h-screen flex-col items-center justify-center">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[450px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Welcome to Advent of TS!
            </h1>
          </div>
          <LoginButton redirectTo={searchParams.redirectTo ?? '/'} />
          <p className="text-muted-foreground mx-auto px-8 text-sm sm:w-[350px]">
            By clicking Login, you agree to our <br />
            <Link href="/tos" className="hover:text-primary underline underline-offset-4">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:text-primary underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
