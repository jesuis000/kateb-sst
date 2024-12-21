from django.db import models
from django.contrib.auth.models import User


class UserQuota(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_minutes = models.IntegerField(default=60)
    used_minutes = models.FloatField(default=0)

    def minutes_remaining(self):
        return max(0, self.total_minutes - self.used_minutes)

    def __str__(self):
        return f"{self.user.username}'s quota - {self.minutes_remaining()} minutes remaining"


class Transcription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to='audio_files/')
    transcription_text = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transcription for {self.user.username} - {self.created_at}"