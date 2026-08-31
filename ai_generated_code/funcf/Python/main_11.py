def sql_injection_check(user_input):

    #Returns false if there is potential for SQL Injection based on these patterns
    #THIS WAS GProduced via common programming aids4
    sql_injection_patterns = [
            r"'.*--",            # Commenting out the rest of the query
            r"'.*;",             # Termination of statement
            r"SELECT.*FROM",     # SELECT statement
            r"INSERT.*INTO",     # INSERT statement
            r"UPDATE.*SET",      # UPDATE statement
            r"DELETE.*FROM",     # DELETE statement
            r"\bUNION\b",        # UNION keyword
            r"\bOR\b",           # OR keyword
            r"\bAND\b",          # AND keyword
            r"EXEC",             # EXEC command
        ]
    #THIS IS THE END OF THE GENERATED CODE

    for i in sql_injection_patterns:
        if re.search(i, user_input, re.IGNORECASE):
            return False
    return True