import { UserResponse } from "@repo/schemas";

export default function Home() {
  const user: UserResponse = {
    id: "1",
    fullName: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <div>
      <h1>Simple Bookmarks</h1>
      <p>{user.fullName}</p>
      <p>{user.email}</p>
    </div>
  );
}
