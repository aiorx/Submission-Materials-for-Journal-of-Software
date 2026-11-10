```python
@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'password', 'email', 'status', 'create_time', 'update_time')
    list_per_page = 20
    ordering = ('-create_time',)
    list_display_links = ('username',)
    # 筛选器
    list_filter = ('username', 'email')  # 过滤器
    search_fields = ('username', 'email')  # 搜索字段
    date_hierarchy = 'update_time'  # 详细时间分层筛选　
```