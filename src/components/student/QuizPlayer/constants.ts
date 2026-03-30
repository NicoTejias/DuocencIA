export const GAME_TYPE_COLORS: Record<string, string> = {
    multiple_choice: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400",
    match: "from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400",
    true_false: "from-green-500/10 to-green-600/5 border-green-500/20 text-green-400",
    fill_blank: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-400",
    order_steps: "from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400",
    trivia: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-400",
    word_search: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400",
    quiz_sprint: "from-red-500/10 to-red-600/5 border-red-500/20 text-red-400",
    memory: "from-pink-500/10 to-pink-600/5 border-pink-500/20 text-pink-400",
};

export const GAME_TYPE_ICONS: Record<string, string> = {
    multiple_choice: "🎯",
    match: "🔗",
    true_false: "✅",
    fill_blank: "✏️",
    order_steps: "🔢",
    trivia: "⚡",
    word_search: "🧩",
    quiz_sprint: "🏃",
    memory: "🧠",
};

export function generateGrid(words: string[], size: number): string[][] {
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""))
    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]]

    for (const word of words) {
        let placed = false
        for (let attempt = 0; attempt < 100 && !placed; attempt++) {
            const dir = directions[Math.floor(Math.random() * directions.length)]
            const maxR = size - (dir[0] >= 0 ? word.length : 1)
            const maxC = size - (dir[1] >= 0 ? word.length : 1)
            const minR = dir[0] < 0 ? word.length - 1 : 0
            const minC = dir[1] < 0 ? word.length - 1 : 0
            if (maxR < minR || maxC < minC) continue

            const startR = Math.floor(Math.random() * (maxR - minR + 1)) + minR
            const startC = Math.floor(Math.random() * (maxC - minC + 1)) + minC

            let canPlace = true
            const cells: { r: number; c: number }[] = []
            for (let i = 0; i < word.length; i++) {
                const r = startR + dir[0] * i
                const c = startC + dir[1] * i
                if (grid[r][c] !== "" && grid[r][c] !== word[i]) { canPlace = false; break }
                cells.push({ r, c })
            }
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    grid[cells[i].r][cells[i].c] = word[i].toUpperCase()
                }
                placed = true
            }
        }
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === "") grid[r][c] = letters[Math.floor(Math.random() * letters.length)]
        }
    }
    return grid
}
