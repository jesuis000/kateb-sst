from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transcription, UserQuota

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class UserQuotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserQuota
        fields = ('total_minutes', 'used_minutes', 'minutes_remaining')

class TranscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcription
        fields = ('id', 'audio_file', 'transcription_text', 'created_at')
        read_only_fields = ('transcription_text', 'created_at')