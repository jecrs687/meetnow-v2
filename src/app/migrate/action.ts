"use server";
import prisma from "@backend/configs/database"
import { GroupStatus, ParticipantRole, ParticipantStatus, Status, User, UserRole, Group, Category } from "@prisma/client"
import { faker } from '@faker-js/faker';
import { promisePoll } from "@utils/promisePoll";


const randomPhotoUrl = () => {
    return `https://picsum.photos/` + (Math.floor(Math.random() * 600) + 400)
}

const generateAddress = () => ({
    city: faker.location.city(),
    country: faker.location.country(),
    address: faker.location.streetAddress(),
    zip: faker.location.zipCode(),
    lat: faker.location.latitude(
        {
            max: 39.5000,
            min: 39.4750
        }
    ),
    lng: faker.location.longitude({
        max: 16.3000,
        min: 16.2750
    }),
})
const generateUser = (partial?: Partial<Omit<User, 'id' | 'addressId'>>) => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'b3a7ac6b46ccfe3fb3ea57b0601edf7467db27d9a8e29e86f4cb97a0cb323073',
    activatedAt: faker.date.recent(),
    gender: faker.person.gender(),
    bio: faker.lorem.paragraphs(),
    address: {
        create: generateAddress()
    },
    photos: {
        createMany:
        {
            skipDuplicates: true,
            data: Array.from({ length: 4 }).map(createPhoto)
        }
    },
    ...partial
})


const generateParticipant = () => ({
    status: faker.helpers.arrayElement([
        ParticipantStatus.ACCEPTED,
        ParticipantStatus.PENDING,
        ParticipantStatus.REJECTED,
        ParticipantStatus.BLOCKED,
        ParticipantStatus.DELETED,
    ]),
    role: faker.helpers.arrayElement([
        ParticipantRole.OWNER,
        ParticipantRole.GUEST,
    ]),
    user: {
        create: generateUser()
    }
})

const createPhoto = () => ({
    url: randomPhotoUrl()
})
const generateGroup = () => ({
    name: faker.word.words(faker.helpers.rangeToNumber(4)),
    number: faker.helpers.rangeToNumber(5),
    date: faker.date.recent(),
    description: faker.lorem.paragraphs(),
    status: faker.helpers.arrayElement([
        GroupStatus.ACTIVE,
        GroupStatus.INACTIVE,
        GroupStatus.CLOSED,
        GroupStatus.HIDDEN
    ]),
    chat: {
        create: {}
    },
    participants: {
        create: generateParticipant()
    },
})
const createPlaces = () => {
    return prisma.place.create({
        data: {
            description: faker.lorem.paragraphs(),
            name: faker.company.name(),
            review: faker.helpers.rangeToNumber(5),
            photos: {
                createMany:
                {
                    skipDuplicates: true,
                    data: Array.from({ length: 4 }).map(createPhoto)
                }
            },
            categories: [...new Set(Array.from({
                length:
                    faker.helpers.rangeToNumber(3) + 1
            }).map(() =>
                faker.helpers.arrayElement(Object.values(Category))
            ))],
            address: {
                create: generateAddress()
            }

        }
    })
}

const createUsers = async () => {
    return prisma.user.create({
        data: generateUser()
    })
}

export default async function migrate() {
    await prisma.photo.deleteMany()
    await prisma.placePhoto.deleteMany()
    await prisma.groupPhoto.deleteMany()
    await prisma.participant.deleteMany()
    await prisma.group.deleteMany()
    await prisma.place.deleteMany()
    await prisma.user.deleteMany()
    await prisma.address.deleteMany()

    try {
        await prisma.user.create({
            data: {
                ...generateUser(),
                role: UserRole.ADMIN,
                email: 'demo@demo.com'
            }
        })
    } catch (e) {
        console.log(e)
    }

    const { results: places } = await promisePoll<undefined,
        Awaited<ReturnType<typeof createPlaces>>
    >(
        createPlaces,
        [...Array(100)].map(() => undefined),
        15
    )
    const { results: users } = await promisePoll<undefined,
        Awaited<ReturnType<typeof createUsers>>
    >(createUsers,
        [...Array(100)].map(() => undefined), 15
    )

    const { results: groups } = await promisePoll<
        Awaited<ReturnType<typeof createPlaces>>,
        { results: Awaited<ReturnType<typeof prisma.group.create>>[] }
    >(
        async (place) => await promisePoll<
            undefined,
            Awaited<ReturnType<typeof prisma.group.create>>
        >(async () => prisma.group.create({
            data: {
                ...generateGroup(),
                place: {
                    connect: {
                        id: place.id
                    }
                },
            }
        }),
            Array.from({ length: 5 }).map(() => undefined),
            15, false
        )
        , places, 5)
    return {
        places, users, groups
    }
}