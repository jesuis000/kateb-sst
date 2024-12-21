from django.contrib import admin
from .models import Transcription, UserQuota

class TranscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'get_duration', 'get_status']
    list_filter = ['user', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['transcription_text', 'created_at']

    def get_duration(self, obj):

        return "N/A"
    get_duration.short_description = 'Duration'

    def get_status(self, obj):
        return "Completed" if obj.transcription_text else "Pending"
    get_status.short_description = 'Status'

class UserQuotaAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_minutes', 'used_minutes', 'minutes_remaining']
    list_filter = ['user']
    search_fields = ['user__username']
    readonly_fields = ['used_minutes']

    def minutes_remaining(self, obj):
        return obj.minutes_remaining()
    minutes_remaining.short_description = 'Minutes Remaining'

admin.site.register(Transcription, TranscriptionAdmin)
admin.site.register(UserQuota, UserQuotaAdmin)