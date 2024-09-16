// app/groups/page.tsx
import dynamic from "next/dynamic";

const GroupsPageComponent = dynamic(
  () => import("@/components/GroupsPageComponent"),
  { ssr: false },
);

export default function GroupsPage() {
  return <GroupsPageComponent />;
}
