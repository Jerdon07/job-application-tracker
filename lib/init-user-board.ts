import connectDB from "./db"
import { Board, Column } from './models'

const DEFAULT_COLUMNS = [
    {
        name: 'Wish List',
        order: 0,
    }, {
        name: 'Applied',
        order: 1,
    }, {
        name: 'Interviewing',
        order: 2,
    }, {
        name: 'Offer',
        order: 3,
    }, {
        name: 'Rejected',
        order: 4,
    }
]

export async function initializeUserBoard(userId: string) {
    try {
        await connectDB()

        // Check if the Board already Exists
        const existingBoard = await Board.findOne({ userId, name: 'Job Hunt' })

        if (existingBoard) return existingBoard

        // Create the Board
        const board = await Board.create({
            name: 'Job Hunt',
            userId: userId,
            columns: []
        })

        // Create Default Columns
        const columns = await Promise.all(
            DEFAULT_COLUMNS.map((col) => Column.create({
                name: col.name,
                order: col.order,
                boardId: board._id,
                jobApplications: []
            }))
        )

        // Update the Board with the New Column IDs
        board.columns = columns.map((col) => col._id)
        await board.save()

        return board

    } catch (err) {
        throw err
    }
}