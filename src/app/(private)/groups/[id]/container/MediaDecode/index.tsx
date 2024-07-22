import { MessageMedia } from "@prisma/client"
import Image from "next/image"

export const MediaDecode = (media: MessageMedia, index) => {
    return (
        <div key={index}>
            <div>
                <div>
                    <Image
                        src={media.url} alt={media.id}
                        width={100} height={100}
                    />
                </div>
                <div>
                    {media.fileSize}
                </div>
            </div>
        </div>
    )
}