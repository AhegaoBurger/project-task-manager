// app/user/page.tsx
import dynamic from "next/dynamic";

// Dynamically import UserProfile with ssr: false
const UserProfile = dynamic(() => import("@/components/UserProfile"), {
  ssr: false,
});

export default function UserPage() {
  return (
    <main>
      <UserProfile />
    </main>
  );
}
