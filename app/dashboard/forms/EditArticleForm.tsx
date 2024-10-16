"use client"

import { CreatePostAction, EditPostActions } from "@/app/actions"
import TailwindEditor from "@/app/components/dashboard/EditorWrapper"
import { SubmitButton } from "@/app/components/dashboard/SubmitButtons"
import { UploadDropzone } from "@/app/utils/UploadthingComponents"
import { PostSchema } from "@/app/utils/zodSchemas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { Prisma } from "@prisma/client"
import { Atom } from "lucide-react"
import Image from 'next/image'
import { JSONContent } from "novel"
import { useActionState, useState } from 'react';
import slugify from "react-slugify"
import { toast } from "sonner"

interface iAppProps {
    data: {
        title: string;
        slug: string;
        smallDescription: string;
        articleContent: any;
        id: string;
        image: string;
    }
    siteId: string;
}


export function EditArticleForm({ data, siteId }: iAppProps) {

    
    const [imageUrl, setImageUrl] = useState<undefined | string>(data.image);
    const [value, setValue] = useState<JSONContent|undefined>(data.articleContent);
    const [title,setTitle] = useState<undefined|string>(data.title)
    const [slug,setSlugValue] = useState<undefined|string>(data.slug)

    const [lastResult, action] = useActionState(EditPostActions, undefined)
    const [form, fields] = useForm({
        lastResult: lastResult ? lastResult : undefined,
        onValidate({formData}) {
            return parseWithZod(formData, {schema:PostSchema})
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput"
    })

    function handleSlugGenration(){
        const titleInput = title
        if(titleInput === undefined || titleInput.length === 0){
            return toast.error("Please enter a title")
        }
        setSlugValue(slugify(titleInput))
        return toast.success("Slug has been generated")
        }
    return(
        <Card className="mt-5">
        <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>Create a new site to get started and see them right here! Click the button below to start.</CardDescription>
        </CardHeader>
        <CardContent>
            <form className="flex flex-col gap-6" id = {form.id} onSubmit = {form.onSubmit} action = {action}>
                <input type="hidden" name="articleId" value={data.id}/>
                <input type="hidden" name="siteId" value={siteId}></input>
                <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input key = {fields.title.key} 
                    name = {fields.title.name}
                    defaultValue = {fields.title.initialValue} 
                    placeholder="Nextjs bloggin application"
                    onChange={(e)=>{setTitle(e.target.value)}}
                    value = {title}
                    ></Input>
                    <p className="text-red-500 text-sm">{fields.title.errors}</p>
                </div>
                <div className="grid gap-2">
                    <Label>Slug</Label>

                    <Input key={fields.slug.key} name={fields.slug.name} 
                    defaultValue= {fields.slug.initialValue} 
                    placeholder="Article Slug"
                    onChange={(e)=>{setSlugValue(e.target.value)}}
                    value = {slug}
                    ></Input>
                    
                    <Button onClick = {handleSlugGenration} className="w-fit" variant="secondary" type="button">
                        <Atom className="mr-2 size-4" /> Generate Slug
                    </Button>
                    
                    <p className="text-red-500 text-sm">{fields.slug.errors}</p>
                </div>
                <div className="grid gap-2">
                    <Label>Small Description</Label>
                    <Textarea 
                    key = {fields.smallDescription.key}
                     name = {fields.smallDescription.name}
                     defaultValue = {data.smallDescription}
                     className="h-32" placeholder="Small Description for blog...."></Textarea>
                    <p className="text-red-500 text-sm">{fields.smallDescription.errors}</p>
                </div>

                <div className="grid gap-2">
                    <Label>Cover Image</Label>
                    <input type="hidden" name={fields.coverImage.name} key={fields.coverImage.key} defaultValue={fields.coverImage.initialValue} value = {imageUrl} />
                    {imageUrl ? (
                        <Image

                            src={imageUrl}
                            alt="Uploaded Image"
                            className="object-cover w-[200] h-[200] rounded-lg"
                            width={200}
                            height={200} />

                    ) : (
                        <UploadDropzone onClientUploadComplete={
                            (res) => {
                                setImageUrl(res[0].url)
                                toast.success("Image has been uploaded");

                            }}
                            endpoint="imageUploader"
                            onUploadError={() => {
                                toast.error("Something went wrong with the upload...");
                            }}
                        />
                    )}
                    <p className="text-red-500 text-sm">{fields.coverImage.errors}</p>
                </div>
                <div className="grid gap-2">
                    <Label>Article Content</Label>
                    <input type="hidden" name={fields.articleContent.name} key={fields.articleContent.key} defaultValue={fields.articleContent.initialValue} value = {JSON.stringify(value)} />
                    <TailwindEditor onChange={setValue} initialValue={value ?? {}} />
                    <p className="text-red-500 text-sm">{fields.articleContent.errors}</p>
                </div>
                <SubmitButton text="Edit Article" />
            </form>
        </CardContent>
    </Card>
    )
    

}