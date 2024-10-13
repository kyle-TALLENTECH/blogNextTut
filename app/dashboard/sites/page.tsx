import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { log } from "console";
import { FileIcon, Plus, PlusCircle } from "lucide-react";
import { RedirectStatusCode } from "next/dist/client/components/redirect-status-code";
import Link from "next/link";
import { redirect } from "next/navigation";
import DefaultImage from "@/public/default.png";
import Image from "next/image";
import { EmptyState } from "@/app/components/dashboard/EmptyState";

async function getData(userId: string) {
    const data = await prisma.site.findMany();
    where: {
        userID: userId
    }
    orderBy: {
        createdAt: "desc"
    }

    return data;
}
export default async function SitesRoute() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        return redirect("/api/auth/login");
    }
    const data = await getData(user.id)
    return (
        <>
            <div className="flex w-full justify-end">
                <Button asChild>
                    <Link href={"/dashboard/sites/new"}>
                        <PlusCircle className="mr-2 size-4" /> Create Site
                    </Link>
                </Button>

            </div>

            {data === undefined || data.length === 0 ? (
                        <EmptyState
                        title="You dont have any Sites created"
                        description="You currently dont have any Sites. Please create some so that you can
                      see them right here!"
                        buttonText="Create Site"
                        href="/dashboard/sites/new"
                      />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                    {data.map((item) => (
                        <Card key={item.id}>
                            <Image src={item.imageUrl ?? DefaultImage}
                                alt={item.name}
                                className="rounded-md object-cover w-full h-[200px]"
                                width={200} height={200} />
                            <CardHeader>
                                <CardTitle>
                                    {item.name}
                                </CardTitle>
                                <CardDescription>
                                    {item.decription}
                                </CardDescription>

                            </CardHeader>

                            <CardFooter>
                                <Button asChild className="w-full">
                                <Link href={`/dashboard/sites/${item.id}`}>View Articles</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                    ))}
                </div>
            )}
        </>
    )
}