'use client';
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type ICardEvents = {
    imageUrl:string,
    title: string,
    date: string,
    price: number,
    organizerLogo?: string,
    organizerName: string,
    href?: string
}

const CardEvents: React.FC<ICardEvents> = ({
    imageUrl,
    title,
    date,
    price,
    organizerLogo,
    organizerName,
    href,
}) => {
    const router = useRouter();

    const handleClick = () => {
        if(href) router.push(href);
    };

    const formatPrice = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);

        const maxTitleLength = 26;
        const trimmedTitle = title.length > maxTitleLength
        ? title.slice(0, maxTitleLength) + '...'
        : title;

        return (
            <div
            className="bg-white rounded-xl w-full shadow hover:shadow-md transition cursor-pointer overflow-hidden "
            onClick={handleClick}
            >
            <div className="relative w-full  aspect-[2/1] overflow-hidden rounded-t-lg">
                <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="100%"
            />
            </div>
            <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold line-clamp-2">{trimmedTitle}</h3>
                <p className="text-sm text-gray-600">📅 {date}</p>
                <p className="text-sm text-gray-800 font-bold">
                🎫 {formatPrice(price)}
                </p>
            <div className="flex items-center mt-3 gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                <Image
                    src={organizerLogo || '/no-photo.jpg'}
                    alt="Organizer Logo"
                    fill
                    className="object-cover"
                />
                </div>
                <span className="text-sm text-gray-700">{organizerName}</span>
            </div>
            </div>
        </div>
        )
}

export default  CardEvents;