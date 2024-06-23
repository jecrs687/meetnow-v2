"use server";
import prisma from "@backend/configs/database"
import { GroupStatus, ParticipantRole, Status, User, UserRole } from "@prisma/client"
import { faker } from '@faker-js/faker';
import { PromisePoll } from "@utils/promisePoll";
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
            max: 39.50,
            min: 39.30
        }
    ),
    lng: faker.location.longitude({
        max: 16.30,
        min: 16.20
    }),
})
const generateUser = () => ({
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

})


const generateParticipant = () => ({
    status: faker.helpers.arrayElement([
        Status.ACTIVE,
        Status.INACTIVE,
        Status.PENDING,
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
            groups: {
                create: {
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
                    }
                }
            },
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

    const places = await PromisePoll(
        Array.from({ length: 10 }).map(createPlaces), 300, 2
    )
    const users = await PromisePoll(
        Array.from({ length: 10 }).map(createUsers), 300, 2
    )
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


    return {
        places, users
    }
}