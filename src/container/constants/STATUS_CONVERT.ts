import { ParticipantStatus } from "@prisma/client";

export const STATUS_CONVERT: {
    [key in ParticipantStatus]: string
} = {
    [ParticipantStatus.ACCEPTED]: "Entrar",
    [ParticipantStatus.PENDING]: "Pendente",
    [ParticipantStatus.REJECTED]: "Pendente",
    [ParticipantStatus.BLOCKED]: "Bloqueado",
    [ParticipantStatus.DELETED]: "Pendente",
    [ParticipantStatus.CANCELED]: "Entrar",
    [ParticipantStatus.DECLINED]: "Desistiu",
}
