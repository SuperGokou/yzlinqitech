"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .order("created_at", { ascending: false });
    setClients(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500">View and manage client profiles</p>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Client List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-gray-100" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">
              No clients found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 hover:bg-transparent">
                  <TableHead className="text-gray-500">Client</TableHead>
                  <TableHead className="text-gray-500">Company</TableHead>
                  <TableHead className="text-gray-500">Phone</TableHead>
                  <TableHead className="text-gray-500">Joined</TableHead>
                  <TableHead className="text-right text-gray-500">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="border-gray-50 hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          {client.avatar_url ? (
                            <AvatarImage src={client.avatar_url} />
                          ) : null}
                          <AvatarFallback className="bg-blue-50 text-blue-700 text-xs">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">
                          {client.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {client.company ?? "--"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {client.phone ?? "--"}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(client.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/orders?client=${client.id}`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-gray-400 hover:text-blue-600"
                        >
                          <ShoppingCart className="size-4" />
                          Orders
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
