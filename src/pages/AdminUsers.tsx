import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Shield, User as UserIcon, Ban, CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  college: string | null;
  created_at: string;
  is_active: boolean;
}

interface UserRole {
  user_id: string;
  role: "admin" | "user";
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"admin" | "user" | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Create a map of user_id to role
      const rolesMap: Record<string, string> = {};
      rolesData?.forEach((role: UserRole) => {
        rolesMap[role.user_id] = role.role;
      });

      setUsers(profilesData || []);
      setUserRoles(rolesMap);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId: string, newRole: "admin" | "user") => {
    setSelectedUserId(userId);
    setSelectedRole(newRole);
    setShowRoleDialog(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUserId || !selectedRole) return;

    try {
      const currentRole = userRoles[selectedUserId];

      if (currentRole === selectedRole) {
        toast({
          title: "No changes",
          description: "User already has this role",
        });
        setShowRoleDialog(false);
        return;
      }

      // Delete existing role
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", selectedUserId);

      if (deleteError) throw deleteError;

      // Insert new role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: selectedUserId, role: selectedRole });

      if (insertError) throw insertError;

      toast({
        title: "Role updated",
        description: `User role changed to ${selectedRole}`,
      });

      await fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setShowRoleDialog(false);
      setSelectedUserId(null);
      setSelectedRole(null);
    }
  };

  const handleSuspendToggle = (user: UserProfile) => {
    setSelectedUser(user);
    setShowSuspendDialog(true);
  };

  const confirmSuspendToggle = async () => {
    if (!selectedUser) return;

    try {
      const newStatus = !selectedUser.is_active;

      const { error } = await supabase
        .from("profiles")
        .update({ is_active: newStatus })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast({
        title: newStatus ? "Account activated" : "Account suspended",
        description: newStatus
          ? "User account has been activated"
          : "User account has been suspended",
      });

      await fetchUsers();
    } catch (error) {
      console.error("Error toggling account status:", error);
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive",
      });
    } finally {
      setShowSuspendDialog(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.college?.toLowerCase().includes(query)
    );
  });

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            View and manage all users and their roles
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(userRoles).filter((role) => role === "admin").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(userRoles).filter((role) => role === "user").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {users.filter((user) => !user.is_active).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Search and manage user accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar_url || ""} />
                              <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.full_name || "No name"}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>{user.college || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={userRoles[user.id] === "admin" ? "default" : "secondary"}>
                            {userRoles[user.id] === "admin" ? (
                              <Shield className="h-3 w-3 mr-1" />
                            ) : (
                              <UserIcon className="h-3 w-3 mr-1" />
                            )}
                            {userRoles[user.id] || "user"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.is_active ? "default" : "destructive"}
                            className="gap-1"
                          >
                            {user.is_active ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <Ban className="h-3 w-3" />
                                Suspended
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={userRoles[user.id] || "user"}
                              onValueChange={(value: "admin" | "user") =>
                                handleRoleChange(user.id, value)
                              }
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant={user.is_active ? "destructive" : "default"}
                              onClick={() => handleSuspendToggle(user)}
                            >
                              {user.is_active ? "Suspend" : "Activate"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Change Confirmation Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user's role to {selectedRole}? This will
              affect their access permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Suspend/Activate Confirmation Dialog */}
      <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.is_active ? "Suspend Account" : "Activate Account"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.is_active
                ? `Are you sure you want to suspend ${selectedUser?.full_name || "this user"}'s account? They will not be able to access the platform while suspended.`
                : `Are you sure you want to activate ${selectedUser?.full_name || "this user"}'s account? They will regain full access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSuspendToggle}
              className={selectedUser?.is_active ? "bg-destructive" : ""}
            >
              {selectedUser?.is_active ? "Suspend" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AdminUsers;
