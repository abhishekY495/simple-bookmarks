import Link from "next/link";

export default function Login() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold -mb-1">Welcome</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to log in
        </p>
      </div>

      {/* <form action=""></form> */}

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary underline underline-offset-4"
        >
          Register
        </Link>
      </p>
    </>
  );
}
