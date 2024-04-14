import { NextRequest } from "next/server";
import { readFileSync } from 'fs'

export async function GET(
    request: NextRequest
) {
    const params = request.nextUrl.searchParams
    const fileName: string | null = params.get('filename')

    if (fileName == null)
        return new Response(null, { status: 400 })

    const rootDirectory = process.cwd()
    const imagesDirectory = rootDirectory + (process.env.DATABASE_LOCATION || '/src/data/database/') + 'images/'
    let images
    try {
        images = readFileSync(imagesDirectory + fileName)
    } catch (error) {
    }
    if (images === undefined)
        return new Response(null, { status: 500})

    const response: Response = new Response(images);
    response.headers.append("content-type", "image/jpg")

    return response
}