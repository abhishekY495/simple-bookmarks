import Link from "next/link";

export default function Register() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold -mb-1">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to register
        </p>
      </div>

      {/* <form action=""></form> */}

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
