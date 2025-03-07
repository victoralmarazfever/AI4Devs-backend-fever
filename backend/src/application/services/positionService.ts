import { PrismaClient } from '@prisma/client';
import { Position } from '../../domain/models/Position';

const prisma = new PrismaClient();

export const getPositionCandidates = async (positionId: number) => {
    const applications = await prisma.application.findMany({
        where: {
            positionId: positionId,
        },
        include: {
            candidate: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                }
            },
            interviewStep: {
                select: {
                    name: true
                }
            },
            interviews: {
                select: {
                    score: true
                }
            }
        }
    });

    return applications.map(application => {
        const scores = application.interviews.map(interview => interview.score).filter(score => score !== null);
        const averageScore = scores.length > 0 
            ? scores.reduce((a, b) => a + b, 0) / scores.length 
            : null;

        return {
            id: application.candidate.id,
            fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
            currentInterviewStep: application.interviewStep.name,
            averageScore: averageScore
        };
    });
};

export const findPositionById = async (id: number): Promise<Position | null> => {
    const data = await prisma.position.findUnique({
        where: { id: id }
    });
    if (!data) return null;
    return new Position(data);
}; 