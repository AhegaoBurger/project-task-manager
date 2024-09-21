// app/testing/page.tsx
import dynamic from "next/dynamic";

// Dynamically import UserProfile with ssr: false
const GroupDisplay = dynamic(() => import("@/components/GroupDisplay"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <GroupDisplay />
    </main>
  );
}
