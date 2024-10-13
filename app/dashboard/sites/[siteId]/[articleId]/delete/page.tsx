import { DeletePost } from "@/app/actions";
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DeleteForm({ params }: { params: { siteId: string; articleId: string } }) {
    return (
        <div className="flex flex-1 items-center justify-center">
            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>
                        Are you absolutely sure?
                    </CardTitle>
                    <CardDescription>
                        This actions cannot be undone. This will delete this article and delte all data from our server.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between w-full">
                    <Button asChild variant="secondary">
                        <Link href={`/dashboard/sites/${params.siteId}`}>
                            Cancel
                        </Link>
                    </Button>
                    <form action={DeletePost}>
                        <input type="hidden" name = "siteId" value={params.siteId}></input>
                        <input type="hidden" name="articleId" value={params.articleId} />
                        <SubmitButton variant="destructive" text="Delete Article Forever" />
                    </form>
                </CardFooter>
            </Card>

        </div>
    )
}