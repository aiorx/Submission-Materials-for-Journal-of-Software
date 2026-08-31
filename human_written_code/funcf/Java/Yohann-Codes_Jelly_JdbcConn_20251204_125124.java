```java
@Override
public void close() {
    if (resultSet != null) {
        try {
            resultSet.close();
        } catch (SQLException e) {
            logger.warn("MySQL关闭ResultSet出现异常", e);
        }
    }
    if (pstmt != null) {
        try {
            pstmt.close();
        } catch (SQLException e) {
            logger.warn("MySQL关闭PreparedStatement出现异常", e);
        }
    }
    if (conn != null) {
        try {
            conn.close();
        } catch (SQLException e) {
            logger.warn("MySQL关闭Connection出现异常", e);
        }
    }
}
```