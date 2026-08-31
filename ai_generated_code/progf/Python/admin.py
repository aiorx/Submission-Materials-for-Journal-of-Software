from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User
from django.http import HttpResponse
import csv

# Aided with basic GitHub coding tools
class CustomUserAdmin(UserAdmin):
    """
    Custom admin interface for User model with additional fields and filters.
    
    Aided with basic GitHub coding tools
    """
    # The fields to be displayed in the list view
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'is_active', 'date_joined')
    
    # Fields to filter the change list by
    list_filter = ('role', 'is_active', 'is_staff', 'date_joined', 'city')
    
    # Fields to search in
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone_number', 'CIN_id')
    
    # Fields to order by
    ordering = ('-date_joined',)
    
    # Fields to use for readonly display
    readonly_fields = ('date_joined', 'last_login', 'created_at', 'updated_at')
    
    # Configuration for the add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'role'),
        }),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'birth_date', 'birth_city', 'CIN_id')
        }),
        (_('Contact info'), {
            'fields': ('phone_number', 'address', 'city')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
    )
    
    # Configuration for the user change form
    fieldsets = (
        (None, {
            'fields': ('email', 'username', 'password')
        }),
        (_('Profile'), {
            'fields': ('first_name', 'last_name', 'Arabic_first_name', 'arabic_last_name', 'role', 'profile_picture')
        }),
        (_('Personal info'), {
            'fields': ('birth_date', 'birth_city', 'CIN_id')
        }),
        (_('Contact info'), {
            'fields': ('phone_number', 'address', 'city')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at'),
        }),
    )
    
    # Admin actions
    actions = ['activate_users', 'deactivate_users', 'export_selected_users']
    
    def activate_users(self, request, queryset):
        """
        Action to activate selected users.
        
        Aided with basic GitHub coding tools
        """
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} users successfully activated.')
    activate_users.short_description = "Activate selected users"
    
    def deactivate_users(self, request, queryset):
        """
        Action to deactivate selected users.
        
        Aided with basic GitHub coding tools
        """
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} users successfully deactivated.')
    deactivate_users.short_description = "Deactivate selected users"
    
    def export_selected_users(self, request, queryset):
        """
        Export selected users to CSV file.
        
        Aided with basic GitHub coding tools
        """
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="users.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Email', 'First Name', 'Last Name', 'Role', 'Phone', 'CIN ID', 'City'])
        
        for user in queryset:
            writer.writerow([
                user.email, 
                user.first_name, 
                user.last_name, 
                user.get_role_display(),
                user.phone_number or '',
                user.CIN_id or '',
                user.city or ''
            ])
            
        return response
    export_selected_users.short_description = "Export selected users to CSV"

# Register the User model with the custom admin class
admin.site.register(User, CustomUserAdmin)
