import { AuthUserResponse } from "@repo/schemas";

export default function Home() {
  const user: AuthUserResponse = {
    id: "123",
    email: "asd",
    fullName: "asd",
    accessToken: "asd",
  };

  return (
    <div>
      <h1>Simple Bookmarks</h1>
      <p>{user.id}</p>
      <p>{user.fullName}</p>
      <p>{user.email}</p>
    </div>
  );
}
