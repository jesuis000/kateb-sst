import requests
from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Transcription, UserQuota
from .serializers import TranscriptionSerializer, UserQuotaSerializer


class UserQuotaViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserQuotaSerializer

    def get_queryset(self):
        return UserQuota.objects.filter(user=self.request.user)


class TranscriptionView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        user_quota = UserQuota.objects.get(user=request.user)
        if user_quota.minutes_remaining() <= 0:
            return Response({'error': 'Quota exceeded'}, status=status.HTTP_403_FORBIDDEN)

        audio_file = request.FILES['file']


        transcription = Transcription.objects.create(
            user=request.user,
            audio_file=audio_file
        )


        files = {'file': (audio_file.name, audio_file, audio_file.content_type)}
        response = requests.post(
            'https://echo-6sdzv54itq-uc.a.run.app/kateb',
            files=files
        )

        if response.status_code == 200:
            result = response.json()
            transcription.transcription_text = result.get('json', {}).get('words', [])
            transcription.save()



            audio_duration_minutes = 1
            user_quota.used_minutes += audio_duration_minutes
            user_quota.save()

            return Response(TranscriptionSerializer(transcription).data)
        else:
            transcription.delete()
            return Response(
                {'error': 'STT service error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
