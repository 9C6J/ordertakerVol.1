import Link from "next/link";
import { useAuth } from "../lib/auth";

const ProfilePage = ({}) => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start py-36 min-h-screen">
      <h2 className="text-4xl my-4">
        Hello, {user && user.email ? user.email : "Supabase User!"}
      </h2>
      {!user && (
        <div>
          You have landed on a protected page.
          <br />
          Please{"  "}
          <Link href="/auth">
            <a className="font-bold text-blue-500">Log In</a>
          </Link>{" "}
          to view the page's full content.
        </div>
      )}
      {user && (
        <div>
          <button
            className="border bg-gray-500 border-gray-600 text-white px-3 py-2 rounded w-full text-center transition duration-150 shadow-lg"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;