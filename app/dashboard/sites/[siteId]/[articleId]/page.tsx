

import { EditArticleForm } from "@/app/dashboard/forms/EditArticleForm";
import prisma from "@/app/utils/db"
import { Button } from "@/components/ui/button";
import { ArrowLeft} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation"

async function getData(postId: string) {

    const data = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        select: {
            title: true,
            smallDescription: true,
            slug: true,
            articleContent: true,
            id: true,
            image: true
        }

    })
    if(!data){
        return notFound();
    }
    return data
}


export default async function EditRoute({
    params,
}:{
    params: {articleId: string , siteId: string};
}){

    const data = await getData(params.articleId)

    return(
        <div>
            <div className="flex items-center ">
                <Button className="mr-3">
                   <Link href={`/dashboard/sites/${params.siteId}`}><ArrowLeft className="size-4" /></Link> 

                </Button>
                <h1 className="semi-bold text-2xl">
                    Edit Article
                </h1>
            </div>
            <EditArticleForm data={data} siteId={params.siteId} />
        </div>

    )
        
    
}