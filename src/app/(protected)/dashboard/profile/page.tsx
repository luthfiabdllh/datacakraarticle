import { auth } from "@/auth"
import { fetchUserProfile } from "@/lib/api/users"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.jwt) {
        redirect("/login")
    }

    const user = await fetchUserProfile(session.user.jwt)

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold tracking-tight mb-8">My Profile</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Manage your personal details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} />
                                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-lg">{user.username}</p>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label>Username</Label>
                            <Input value={user.username} readOnly />
                        </div>
                        <div className="space-y-1">
                            <Label>Email</Label>
                            <Input value={user.email} readOnly />
                        </div>
                        <div className="space-y-1">
                            <Label>Member since</Label>
                            <Input value={new Date(user.createdAt).toLocaleDateString()} readOnly />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                        <CardDescription>
                            Your account standing and verification status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Confirmed</Label>
                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                                    {user.confirmed ? "Yes" : "No"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Blocked</Label>
                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50">
                                    {user.blocked ? "Yes" : "No"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Provider</Label>
                                <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 capitalize">
                                    {user.provider}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
