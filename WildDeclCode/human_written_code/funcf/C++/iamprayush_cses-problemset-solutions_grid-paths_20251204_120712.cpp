```cpp
void move(int r, int c, int &ans, int &steps)
{
    if (r == n - 1 && c == 0)
    {
        ans += (steps == n * n - 1);
        return;
    }

    // if you hit a wall or a path (can only go left or right); return
    if (((r + 1 == n || (visited[r - 1][c] && visited[r + 1][c])) && c - 1 >= 0 && c + 1 < n && !visited[r][c - 1] && !visited[r][c + 1]) ||
        ((c + 1 == n || (visited[r][c - 1] && visited[r][c + 1])) && r - 1 >= 0 && r + 1 < n && !visited[r - 1][c] && !visited[r + 1][c]) ||
        ((r == 0 || (visited[r + 1][c] && visited[r - 1][c])) && c - 1 >= 0 && c + 1 < n && !visited[r][c - 1] && !visited[r][c + 1]) ||
        ((c == 0 || (visited[r][c + 1] && visited[r][c - 1])) && r - 1 >= 0 && r + 1 < n && !visited[r - 1][c] && !visited[r + 1][c]))
        return;

    visited[r][c] = true;

    if (reserved[steps] != -1)
    {
        switch (reserved[steps])
        {
        case 0:
            if (r - 1 >= 0)
            {
                if (!visited[r - 1][c])
                {
                    steps++;
                    move(r - 1, c, ans, steps);
                    steps--;
                }
            }
            break;

        case 1:
            if (c + 1 < n)
            {
                if (!visited[r][c + 1])
                {
                    steps++;
                    move(r, c + 1, ans, steps);
                    steps--;
                }
            }
            break;

        case 2:
            if (r + 1 < n)
            {
                if (!visited[r + 1][c])
                {
                    steps++;
                    move(r + 1, c, ans, steps);
                    steps--;
                }
            }
            break;

        case 3:
            if (c - 1 >= 0)
            {
                if (!visited[r][c - 1])
                {
                    steps++;
                    move(r, c - 1, ans, steps);
                    steps--;
                }
            }
            break;
        }
        visited[r][c] = false;
        return;
    }

    // move down
    if (r + 1 < n)
    {
        if (!visited[r + 1][c])
        {
            steps++;
            move(r + 1, c, ans, steps);
            steps--;
        }
    }

    // move right
    if (c + 1 < n)
    {
        if (!visited[r][c + 1])
        {
            steps++;
            move(r, c + 1, ans, steps);
            steps--;
        }
    }

    // move up
    if (r - 1 >= 0)
    {
        if (!visited[r - 1][c])
        {
            steps++;
            move(r - 1, c, ans, steps);
            steps--;
        }
    }

    // move left
    if (c - 1 >= 0)
    {
        if (!visited[r][c - 1])
        {
            steps++;
            move(r, c - 1, ans, steps);
            steps--;
        }
    }
    visited[r][c] = false;
}
```