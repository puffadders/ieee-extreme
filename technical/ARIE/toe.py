import math

PLAYER = 'X'
AI = 'O'
EMPTY = ' '

def print_board(board):
    print("\n")
    for i in range(3):
        print(" " + " | ".join(board[i]))
        if i < 2:
            print("---|---|---")
    print("\n")

def is_moves_left(board):
    for row in board:
        if EMPTY in row:
            return True
    return False

def evaluate(board):
    # Rows
    for row in range(3):
        if board[row][0] == board[row][1] == board[row][2]:
            if board[row][0] == AI:
                return 10
            elif board[row][0] == PLAYER:
                return -10

    # Columns
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col]:
            if board[0][col] == AI:
                return 10
            elif board[0][col] == PLAYER:
                return -10

    # Diagonals
    if board[0][0] == board[1][1] == board[2][2]:
        if board[0][0] == AI:
            return 10
        elif board[0][0] == PLAYER:
            return -10

    if board[0][2] == board[1][1] == board[2][0]:
        if board[0][2] == AI:
            return 10
        elif board[0][2] == PLAYER:
            return -10

    return 0

def minimax(board, depth, is_maximizing):
    score = evaluate(board)

    if score == 10:
        return score - depth  # Encourage faster win
    if score == -10:
        return score + depth  # Delay losing

    if not is_moves_left(board):
        return 0

    if is_maximizing:
        best = -math.inf
        for i in range(3):
            for j in range(3):
                if board[i][j] == EMPTY:
                    board[i][j] = AI
                    best = max(best, minimax(board, depth + 1, False))
                    board[i][j] = EMPTY
        return best
    else:
        best = math.inf
        for i in range(3):
            for j in range(3):
                if board[i][j] == EMPTY:
                    board[i][j] = PLAYER
                    best = min(best, minimax(board, depth + 1, True))
                    board[i][j] = EMPTY
        return best

def find_best_move(board):
    best_val = -math.inf
    best_move = (-1, -1)

    for i in range(3):
        for j in range(3):
            if board[i][j] == EMPTY:
                board[i][j] = AI
                move_val = minimax(board, 0, False)
                board[i][j] = EMPTY

                if move_val > best_val:
                    best_val = move_val
                    best_move = (i, j)
    return best_move

def main():
    board = [[EMPTY for _ in range(3)] for _ in range(3)]
    print("=== Tic-Tac-Toe (You vs AI) ===")
    print_board(board)

    while True:
        # Player move
        try:
            r, c = map(int, input("Enter your move (row and col 1-3): ").split())
        except ValueError:
            print("Invalid input. Enter two numbers 1-3.")
            continue
        r, c = r - 1, c - 1

        if r not in range(3) or c not in range(3) or board[r][c] != EMPTY:
            print("Invalid move! Try again.")
            continue

        board[r][c] = PLAYER
        print_board(board)

        if evaluate(board) == -10:
            print("You win!")
            break
        if not is_moves_left(board):
            print("It's a draw!")
            break

        # AI move
        print("AI is thinking...")
        move = find_best_move(board)
        board[move[0]][move[1]] = AI
        print_board(board)

        if evaluate(board) == 10:
            print("AI wins!")
            break
        if not is_moves_left(board):
            print("It's a draw!")
            break

if __name__ == "__main__":
    main()
