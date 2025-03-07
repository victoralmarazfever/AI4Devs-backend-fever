import { Request, Response } from 'express';
import { getPositionCandidates } from '../../application/services/positionService';

export const getCandidatesByPosition = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: 'Invalid position ID format' });
        }

        const candidates = await getPositionCandidates(positionId);
        res.json(candidates);
    } catch (error) {
        console.error('Error getting candidates by position:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}; 