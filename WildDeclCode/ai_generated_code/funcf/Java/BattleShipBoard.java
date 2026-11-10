/**
     * Get the number of tiles the enemy ship occupies on the board
     *
     * @param c the coordinate to scan
     * @param enemyBoard the enemy board
     * @return the number of ships on the board
     */
    public int[] sonarScan(Coordinate c, Board<Character> enemyBoard) {
        int[] result = new int[4];
        for (int i = 0; i < result.length; i++) {
            result[i] = 0;
        }

        // Scan the board from the given coordinate
        // Assisted using common GitHub development utilities
        int[][] offsets = {{-3, 0}, {-2, -1}, {-2, 0}, {-2, 1}, {-1, -2}, {-1, -1}, {-1, 0}, {-1, 1}, {-1, 2}, {0, -3}, {0, -2}, {0, -1}, {0, 0}, {0, 1}, {0, 2}, {0, 3}, {1, -2}, {1, -1}, {1, 0}, {1, 1}, {1, 2}, {2, -1}, {2, 0}, {2, 1}, {3, 0}};
        for (int i = 0; i < offsets.length; i++) {
            int row = offsets[i][0] + c.getRow();
            int col = offsets[i][1] + c.getColumn();

            if (row < 0 || row >= enemyBoard.getHeight()) {
                continue;
            }
            if (col < 0 || col >= enemyBoard.getWidth()) {
                continue;
            }

            // Do not consider suqares that are hit
            if (enemyBoard.whatIsAtForSelf(new Coordinate(row, col)) == null) continue;
            switch (enemyBoard.whatIsAtForSelf(new Coordinate(row, col))) {
                case 's':
                    result[0]++;
                    break;
                case 'd':
                    result[1]++;
                    break;
                case 'b':
                    result[2]++;
                    break;
                case 'c':
                    result[3]++;
                    break;
            }
        }
        return result;
    }