"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertCircle, ChevronRight, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Group {
  chatId: number;
  title: string;
  type: string;
}

export default function GroupDisplay() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/getGroups");
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data: { groups: Group[] } = await response.json();
      setGroups(data.groups);
      setHasFetched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Groups</h2>
        <Button onClick={fetchGroups} disabled={loading}>
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {hasFetched ? "Refresh Groups" : "Fetch Groups"}
        </Button>
      </div>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && hasFetched && (
        <>
          {groups.length === 0 ? (
            <p className="text-center text-gray-500">No groups found</p>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => (
                <Card key={group.chatId} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{group.title}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {group.type}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && !hasFetched && (
        <p className="text-center text-gray-500">
          Click the button above to fetch groups
        </p>
      )}
    </Card>
  );
}
